package com.crypto.trading.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.dto.CoinPrice;  // UpbitPrice 대신 CoinPrice로 변경
import com.crypto.trading.dto.OrderCreateRequest;
import com.crypto.trading.dto.OrderResponse;
import com.crypto.trading.dto.TransactionCreateRequest;
import com.crypto.trading.entity.Account;
import com.crypto.trading.entity.Order;
import com.crypto.trading.entity.Transaction;
import com.crypto.trading.entity.Order.OrderStatus;
import com.crypto.trading.entity.Order.OrderType;
import com.crypto.trading.entity.Transaction.TransactionType;
import com.crypto.trading.repository.AccountRepository;
import com.crypto.trading.repository.OrderRepository;
import com.crypto.trading.service.TransactionService.InvestmentLimitWarningException;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;  // 이 import 추가

import org.springframework.transaction.annotation.Propagation;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
    private final OrderRepository orderRepository;
    private final AccountRepository accountRepository;
    private final TransactionService transactionService;
    private final UpbitService upbitService;

    // 지정가 주문 생성
    @Transactional
    public Order createLimitOrder(OrderCreateRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("계좌를 찾을 수 없습니다."));

        // 주문 유효성 검증
        validateOrder(account, request);

        Order order = Order.builder()
                .account(account)
                .coinSymbol(request.getCoinSymbol())
                .targetPrice(request.getTargetPrice())
                .quantity(request.getQuantity())
                .type(request.getType())
                .status(OrderStatus.PENDING)
                .build();

        return orderRepository.save(order);
    }

    // 주문 취소
    @Transactional
    public void cancelOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다: " + orderId));

            if (order.getStatus() != OrderStatus.PENDING) {
                throw new IllegalStateException("대기 상태의 주문만 취소할 수 있습니다.");
            }

            order.setStatus(OrderStatus.CANCELLED);
            order.setCompletedAt(LocalDateTime.now());
            orderRepository.save(order);
            
            log.info("주문 취소 완료: orderId={}", orderId);
        } catch (Exception e) {
            log.error("주문 취소 실패: {}", e.getMessage());
            throw e;
        }
    }

    // 주문 체결 확인 및 처리 (스케줄러에서 주기적으로 실행)
 // 주문 체결 확인 및 처리 (스케줄러에서 주기적으로 실행)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processOrders() {
        List<Order> pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING);

        for (Order order : pendingOrders) {
            try {
                processSingleOrder(order);
            } catch (Exception e) {
                log.error("주문 처리 중 오류 발생: orderId={}", order.getId(), e);
                handleOrderError(order, e);
            }
        }
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void processSingleOrder(Order order) {
        try {
            CoinPrice currentPrice = upbitService.getCoinPrice("KRW-" + order.getCoinSymbol());
            BigDecimal currentMarketPrice = BigDecimal.valueOf(currentPrice.getTrade_price());

            if (order.getType() == OrderType.BUY && 
                currentMarketPrice.compareTo(order.getTargetPrice()) <= 0) {
                executeOrder(order, currentMarketPrice);
            }
            else if (order.getType() == OrderType.SELL && 
                     currentMarketPrice.compareTo(order.getTargetPrice()) >= 0) {
                executeOrder(order, currentMarketPrice);
            }
        } catch (Exception e) {
            log.error("주문 처리 실패: orderId={}", order.getId(), e);
            throw e;
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void executeOrder(Order order, BigDecimal executionPrice) {
        try {
            TransactionCreateRequest txRequest = new TransactionCreateRequest();
            txRequest.setAccountId(order.getAccount().getId());
            txRequest.setCoinSymbol(order.getCoinSymbol());
            txRequest.setPrice(executionPrice);
            txRequest.setQuantity(order.getQuantity());
            txRequest.setType(order.getType() == OrderType.BUY ? TransactionType.BUY : TransactionType.SELL);

            try {
                // 먼저 일반 거래 시도
                transactionService.createTransaction(txRequest);
            } catch (InvestmentLimitWarningException e) {
                log.info("투자한도 초과로 강제 매수 진행: orderId={}", order.getId());
                // 실패 시 강제 매수
                transactionService.forceBuyTransaction(txRequest);
            }

            // 주문 상태 업데이트는 거래 성공 후에만 실행
            completeOrder(order);
        } catch (Exception e) {
            // 거래 실패 시 주문 취소 처리
            handleOrderError(order, e);
            throw e;  // 예외를 다시 던져서 트랜잭션 롤백
        }
    }
    
    private void completeOrder(Order order) {
        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        orderRepository.save(order);
    }
    
    private void handleOrderError(Order order, Exception e) {
        try {
            order.setStatus(OrderStatus.CANCELLED);
            order.setCompletedAt(LocalDateTime.now());
            orderRepository.save(order);
            log.info("주문 상태 취소로 변경: orderId={}", order.getId());
        } catch (Exception saveError) {
            log.error("주문 상태 업데이트 실패: orderId={}", order.getId(), saveError);
        }
    }

    // 지정가 주문 목록 조회
    public List<Order> getOrdersByAccountId(Long accountId) {
        return orderRepository.findByAccountId(accountId);
    }

    // 대기중인 주문 목록 조회
    public List<OrderResponse> getPendingOrdersByAccountId(Long accountId) {
        return orderRepository.findByAccountIdAndStatus(accountId, OrderStatus.PENDING)
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }
    
    

    private void validateOrder(Account account, OrderCreateRequest request) {
        // 매수 주문의 경우
        if (request.getType() == OrderType.BUY) {
            BigDecimal totalAmount = request.getTargetPrice().multiply(request.getQuantity());
            if (account.getBalance().compareTo(totalAmount) < 0) {
                throw new IllegalStateException("잔액이 부족합니다.");
            }
        }
        // 매도 주문의 경우
        else {
            BigDecimal holdingQuantity = transactionService.calculateHoldingQuantity(
                account.getId(), request.getCoinSymbol());
            if (holdingQuantity.compareTo(request.getQuantity()) < 0) {
                throw new IllegalStateException("보유 수량이 부족합니다.");
            }
        }
    }
}