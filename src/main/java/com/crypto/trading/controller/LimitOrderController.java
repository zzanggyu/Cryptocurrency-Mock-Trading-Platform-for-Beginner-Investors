package com.crypto.trading.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.OrderCreateRequest;
import com.crypto.trading.dto.OrderResponse;
import com.crypto.trading.entity.Order;
import com.crypto.trading.repository.OrderRepository;
import com.crypto.trading.service.OrderService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@RequestMapping("/api/limit-orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") 
public class LimitOrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> createLimitOrder(@RequestBody @Valid OrderCreateRequest request) {
        try {
            Order order = orderService.createLimitOrder(request);
            return ResponseEntity.ok(order);
        } catch (EntityNotFoundException e) {
            log.error("계좌를 찾을 수 없습니다: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            log.error("주문 생성 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("주문 처리 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 처리 중 오류가 발생했습니다.");
        }
    }


    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<OrderResponse>> getLimitOrders(@PathVariable("accountId") Long accountId) {
        try {
            log.info("계좌 ID {} 의 대기 주문 조회", accountId);
            List<OrderResponse> orders = orderService.getPendingOrdersByAccountId(accountId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("주문 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancelLimitOrder(@PathVariable("orderId") Long orderId) {
        try {
            log.info("주문 취소 요청: orderId={}", orderId);
            orderService.cancelOrder(orderId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            log.warn("주문을 찾을 수 없음: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            log.warn("주문 취소 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("주문 취소 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("주문 취소 중 오류가 발생했습니다.");
        }
    }

  
}