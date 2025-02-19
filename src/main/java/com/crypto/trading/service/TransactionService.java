package com.crypto.trading.service;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.dto.CoinPrice;
import com.crypto.trading.dto.CoinSummaryDTO;
import com.crypto.trading.dto.DailyProfitDTO;
import com.crypto.trading.dto.PeriodProfitDTO;
import com.crypto.trading.dto.TransactionCreateRequest;
import com.crypto.trading.entity.Account;
import com.crypto.trading.entity.Transaction;
import com.crypto.trading.entity.Transaction.TransactionType;
import com.crypto.trading.repository.AccountRepository;
import com.crypto.trading.repository.TransactionRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UpbitService upbitService;

    // 거래 생성
    @Transactional(rollbackFor = Exception.class)
    public Transaction createTransaction(TransactionCreateRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("계좌를 찾을 수 없습니다."));

        // 거래 유효성 검증
        if (request.getType() == TransactionType.BUY) {
            // 시장가 매수의 경우 수량이 아닌 금액으로 계산
            if (request.isMarketPrice()) {
                BigDecimal currentPrice = BigDecimal.valueOf(
                    upbitService.getCoinPrice("KRW-" + request.getCoinSymbol()).getTrade_price()
                );
                request.setQuantity(request.getAmount().divide(currentPrice, 8, RoundingMode.DOWN));
                request.setPrice(currentPrice);
            }
            validateBuyTransaction(account, request);
        } else {
            validateSellTransaction(account, request);
        }

        // 거래 생성
        Transaction transaction = Transaction.builder()
                .account(account)
                .coinSymbol(request.getCoinSymbol())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .amount(request.getPrice().multiply(request.getQuantity()))
                .type(request.getType())
                .build();

        // 거래 정보 저장
        Transaction savedTransaction = transactionRepository.save(transaction);

        // 계좌 잔액 업데이트
        updateAccountBalance(account, savedTransaction);

        return savedTransaction;
    }

    @Transactional(rollbackFor = Exception.class)
    public Transaction forceBuyTransaction(TransactionCreateRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("계좌를 찾을 수 없습니다."));

        // 잔액 검증만 수행 (투자한도 검증은 건너뜀)
        validateBalance(account, request);

        Transaction transaction = Transaction.builder()
                .account(account)
                .coinSymbol(request.getCoinSymbol())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .amount(request.getPrice().multiply(request.getQuantity()))
                .type(request.getType())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        updateAccountBalance(account, savedTransaction);

        return savedTransaction;
    }
    
   public List<Transaction> getTransactionsByAccountId(Long accountId) {
       return transactionRepository.findByAccountIdOrderByTransactionDateTimeDesc(accountId);
   }

   public List<Transaction> getTransactionsByDateRange(Long accountId, LocalDateTime startDate, LocalDateTime endDate) {
       return transactionRepository.findByAccountIdAndDateRange(accountId, startDate, endDate);
   }

   public List<CoinSummaryDTO> getCoinSummary(Long accountId) {
	    List<CoinSummaryDTO> summaries = transactionRepository.getCoinSummaryByAccountId(accountId);
	    
	    return summaries.stream()
	            .map(summary -> {
	                if (summary.getTotalQuantity().compareTo(BigDecimal.ZERO) <= 0) {
	                    return summary; // 보유 수량이 0 이하면 처리하지 않음
	                }

	                try {
	                    // 현재가 조회
	                    CoinPrice currentPriceInfo = upbitService.getCoinPrice("KRW-" + summary.getCoinSymbol());
	                    BigDecimal currentPrice = BigDecimal.valueOf(currentPriceInfo.getTrade_price());
	                    
	                    // 현재가 설정
	                    summary.setCurrentPrice(currentPrice);
	                    
	                    // 현재 평가 금액 계산 (현재가 * 보유수량)
	                    BigDecimal currentValue = currentPrice.multiply(summary.getTotalQuantity());
	                    summary.setCurrentValue(currentValue);
	                    
	                    // 손익 계산 (현재 평가 금액 - 총 매수 금액)
	                    BigDecimal profitLoss = currentValue.subtract(summary.getTotalBuyAmount());
	                    summary.setProfitLoss(profitLoss);
	                    
	                    // 수익률 계산 ((현재 평가 금액 - 총 매수 금액) / 총 매수 금액 * 100)
	                    if (summary.getTotalBuyAmount().compareTo(BigDecimal.ZERO) > 0) {
	                        BigDecimal profitLossRate = profitLoss
	                            .multiply(BigDecimal.valueOf(100))
	                            .divide(summary.getTotalBuyAmount(), 2, RoundingMode.HALF_UP);
	                        summary.setProfitLossRate(profitLossRate);
	                    }
	                    
	                } catch (Exception e) {
	                    log.error("코인 {} 현재가 조회 실패: {}", summary.getCoinSymbol(), e.getMessage());
	                    summary.setCurrentPrice(BigDecimal.ZERO);
	                    summary.setCurrentValue(BigDecimal.ZERO);
	                    summary.setProfitLoss(BigDecimal.ZERO);
	                    summary.setProfitLossRate(BigDecimal.ZERO);
	                }
	                
	                return summary;
	            })
	            .filter(summary -> summary.getTotalQuantity().compareTo(BigDecimal.ZERO) > 0) // 보유 수량이 있는 코인만 필터링
	            .collect(Collectors.toList());
	}

   private void validateBuyTransaction(Account account, TransactionCreateRequest request) {
       BigDecimal purchaseAmount = request.getPrice().multiply(request.getQuantity());

       if (account.getBalance().compareTo(purchaseAmount) < 0) {
           throw new IllegalStateException("잔액이 부족합니다.");
       }

       BigDecimal currentInvestment = calculateCurrentInvestment(account.getId(), request.getCoinSymbol());
       BigDecimal totalAfterPurchase = currentInvestment.add(purchaseAmount);

       if (totalAfterPurchase.compareTo(account.getInvestmentLimit()) > 0) {
           throw new InvestmentLimitWarningException(
               String.format("투자한도 초과 경고! 현재 투자금액: %s원, 추가 매수금액: %s원, 투자한도: %s원", 
                   currentInvestment, purchaseAmount, account.getInvestmentLimit())
           );
       }
   }

   private void validateSellTransaction(Account account, TransactionCreateRequest request) {
       BigDecimal holdingQuantity = calculateHoldingQuantity(account.getId(), request.getCoinSymbol());
       if (holdingQuantity.compareTo(request.getQuantity()) < 0) {
           throw new IllegalStateException("보유 수량이 부족합니다.");
       }
   }

   private void validateBalance(Account account, TransactionCreateRequest request) {
       BigDecimal totalAmount = request.getPrice().multiply(request.getQuantity());
       if (account.getBalance().compareTo(totalAmount) < 0) {
           throw new IllegalStateException("잔액이 부족합니다.");
       }
   }

   private void updateAccountBalance(Account account, Transaction transaction) {
	    BigDecimal transactionAmount = transaction.getPrice().multiply(transaction.getQuantity());
	    if (transaction.getType() == TransactionType.BUY) {
	        account.decreaseBalance(transactionAmount);
	        account.increaseInvestmentAmount(transactionAmount);  // 투자금액 증가
	    } else {
	        account.increaseBalance(transactionAmount);
	        account.decreaseInvestmentAmount(transactionAmount);  // 투자금액 감소
	    }
	}

   public BigDecimal calculateCurrentInvestment(Long accountId, String coinSymbol) {
       List<Transaction> transactions = transactionRepository.findByAccountIdAndCoinSymbol(accountId, coinSymbol);
       return transactions.stream()
               .map(t -> t.getType() == TransactionType.BUY ? t.getAmount() : t.getAmount().negate())
               .reduce(BigDecimal.ZERO, BigDecimal::add);
   }

   public BigDecimal calculateHoldingQuantity(Long accountId, String coinSymbol) {
       List<Transaction> transactions = transactionRepository.findByAccountIdAndCoinSymbol(accountId, coinSymbol);
       return transactions.stream()
               .map(t -> t.getType() == TransactionType.BUY ? t.getQuantity() : t.getQuantity().negate())
               .reduce(BigDecimal.ZERO, BigDecimal::add);
   }

   public static class InvestmentLimitWarningException extends RuntimeException {
       public InvestmentLimitWarningException(String message) {
           super(message);
       }
   }
   
   public PeriodProfitDTO calculatePeriodProfits(Long accountId, String period) {
	    // period에 따라 날짜 범위 계산
	    LocalDateTime endDate = LocalDateTime.now();
	    LocalDateTime startDate = switch (period) {
	        case "daily" -> endDate.minusDays(1);
	        case "weekly" -> endDate.minusWeeks(1);
	        case "monthly" -> endDate.minusMonths(1);
	        default -> throw new IllegalArgumentException("Invalid period: " + period);
	    };

	    // 해당 기간의 거래 내역 조회
	    List<Transaction> transactions = transactionRepository.findByAccountIdAndDateRange(
	        accountId, startDate, endDate);

	    double initialInvestment = 0;
	    double currentValue = 0;
	    Map<String, Double> holdingQuantities = new HashMap<>();
	    Map<String, Double> avgBuyPrices = new HashMap<>();

	    // 초기 보유량과 평균 매수가 계산
	    for (Transaction tx : transactions) {
	        String coinSymbol = tx.getCoinSymbol();
	        double quantity = tx.getQuantity().doubleValue();
	        double price = tx.getPrice().doubleValue();

	        if (tx.getType() == TransactionType.BUY) {
	            holdingQuantities.merge(coinSymbol, quantity, Double::sum);
	            double totalCost = price * quantity;
	            avgBuyPrices.merge(coinSymbol, totalCost, Double::sum);
	            initialInvestment += totalCost;
	        } else {
	            holdingQuantities.merge(coinSymbol, -quantity, Double::sum);
	            avgBuyPrices.merge(coinSymbol, -(price * quantity), Double::sum);
	            initialInvestment -= price * quantity;
	        }
	    }

	    // 현재가 조회 및 현재 가치 계산
	    for (Map.Entry<String, Double> entry : holdingQuantities.entrySet()) {
	        String coinSymbol = entry.getKey();
	        Double quantity = entry.getValue();
	        
	        if (quantity > 0) {
	            try {
	                CoinPrice currentPrice = upbitService.getCoinPrice("KRW-" + coinSymbol);
	                currentValue += quantity * currentPrice.getTrade_price();
	            } catch (Exception e) {
	                log.error("현재가 조회 실패: {}", e.getMessage());
	            }
	        }
	    }

	    // 일별 수익률 계산
	    List<DailyProfitDTO> dailyProfits = new ArrayList<>();
	    LocalDateTime iterDate = startDate;

	    while (!iterDate.isAfter(endDate)) {
	        final LocalDateTime currentDateTime = iterDate;  // 현재 시간을 final 변수로 캡처
	        LocalDateTime nextDate = iterDate.plusDays(1);
	        
	        double dailyProfit = transactions.stream()
	            .filter(tx -> tx.getTransactionDateTime().isAfter(currentDateTime) 
	                      && tx.getTransactionDateTime().isBefore(nextDate))
	            .mapToDouble(tx -> {
	                if (tx.getType() == TransactionType.SELL) {
	                    return tx.getAmount().doubleValue() - 
	                           (tx.getQuantity().doubleValue() * avgBuyPrices.getOrDefault(tx.getCoinSymbol(), 0.0));
	                }
	                return 0.0;
	            })
	            .sum();

	        double dailyProfitRate = initialInvestment > 0 ? (dailyProfit / initialInvestment) * 100 : 0;

	        dailyProfits.add(DailyProfitDTO.builder()
	            .date(currentDateTime)
	            .profit(dailyProfit)
	            .profitRate(dailyProfitRate)
	            .build());

	        iterDate = nextDate;  // 다음 날짜로 이동
	    }

	    // 총 수익률 계산
	    double totalProfit = currentValue - initialInvestment;
	    double totalProfitRate = initialInvestment > 0 ? (totalProfit / initialInvestment) * 100 : 0;

	    return PeriodProfitDTO.builder()
	        .totalProfit(totalProfit)
	        .totalProfitRate(totalProfitRate)
	        .dailyProfits(dailyProfits)
	        .build();
	}
}