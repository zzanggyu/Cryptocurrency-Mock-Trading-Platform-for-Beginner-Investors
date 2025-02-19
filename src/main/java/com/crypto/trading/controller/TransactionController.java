package com.crypto.trading.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.CoinSummaryDTO;
import com.crypto.trading.dto.PeriodProfitDTO;
import com.crypto.trading.dto.TransactionCreateRequest;
import com.crypto.trading.dto.TransactionResponse;
import com.crypto.trading.entity.Transaction;
import com.crypto.trading.service.TransactionService;
import com.crypto.trading.service.TransactionService.InvestmentLimitWarningException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000") 
public class TransactionController {

   private final TransactionService transactionService;

   @PostMapping
   public ResponseEntity<?> createTransaction(@RequestBody @Valid TransactionCreateRequest request) {
       try {
           log.info("거래 요청 받음: {}", request);
           return ResponseEntity.ok(transactionService.createTransaction(request));
       } catch (InvestmentLimitWarningException e) {
           log.warn("투자한도 초과 경고: {}", e.getMessage());
           return ResponseEntity.status(HttpStatus.CONFLICT)
                   .body(new WarningResponse(e.getMessage()));
       } catch (IllegalStateException e) {
           log.error("거래 생성 실패: {}", e.getMessage());
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

   @PostMapping("/force") 
   public ResponseEntity<?> forceTransaction(@RequestBody @Valid TransactionCreateRequest request) {
       try {
           log.info("강제 매수 요청 받음: {}", request);
           return ResponseEntity.ok(transactionService.forceBuyTransaction(request));
       } catch (Exception e) {
           log.error("강제 매수 실패: {}", e.getMessage());
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

   @GetMapping("/account/{accountId}")
   public ResponseEntity<List<TransactionResponse>> getTransactionsByAccount(
           @PathVariable("accountId") Long accountId) {
       List<Transaction> transactions = transactionService.getTransactionsByAccountId(accountId);
       List<TransactionResponse> responses = transactions.stream()
               .map(TransactionResponse::from)
               .collect(Collectors.toList());
       return ResponseEntity.ok(responses);
   }

   @GetMapping("/account/{accountId}/period")
   public ResponseEntity<List<Transaction>> getTransactionsByPeriod(
           @PathVariable("accountId") Long accountId,
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
       return ResponseEntity.ok(transactionService.getTransactionsByDateRange(accountId, startDate, endDate));
   }

   @GetMapping("/account/{accountId}/summary")
   public ResponseEntity<List<CoinSummaryDTO>> getCoinSummary(@PathVariable("accountId") Long accountId) {
       try {
           //log.info("보유 코인 조회 요청 - 계좌 ID: {}", accountId);
           List<CoinSummaryDTO> summaries = transactionService.getCoinSummary(accountId);
           return ResponseEntity.ok(summaries);
       } catch (Exception e) {
           log.error("보유 코인 조회 실패 - 계좌 ID: {}, 에러: {}", accountId, e.getMessage(), e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }

   static class WarningResponse {
       private final String message;
       private final String warningType = "INVESTMENT_LIMIT_EXCEEDED";

       public WarningResponse(String message) {
           this.message = message;
       }

       public String getMessage() {
           return message;
       }

       public String getWarningType() {
           return warningType;
       }
   }
   
   @GetMapping("/account/{accountId}/holdings")
   public ResponseEntity<List<CoinSummaryDTO>> getHoldings(@PathVariable("accountId") Long accountId) {
       try {
           //log.info("보유 코인 조회 요청 - 계좌 ID: {}", accountId); // 로그 추가
           List<CoinSummaryDTO> holdings = transactionService.getCoinSummary(accountId);
           //log.info("조회된 코인 정보: {}", holdings); // 로그 추가
           return ResponseEntity.ok(holdings);
       } catch (Exception e) {
           log.error("보유 코인 조회 실패 - 계좌 ID: {}, 에러: {}", accountId, e.getMessage(), e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }
   
   @GetMapping("/account/{accountId}/profits")
   public ResponseEntity<?> getPeriodProfits(
       @PathVariable("accountId") Long accountId,
       @RequestParam("period") String period
   ) {
       try {
           log.info("기간별 수익률 조회 요청 - 계좌 ID: {}, 기간: {}", accountId, period);
           // PeriodProfitDTO를 새로 만들어야 합니다
           PeriodProfitDTO profits = transactionService.calculatePeriodProfits(accountId, period);
           return ResponseEntity.ok(profits);
       } catch (Exception e) {
           log.error("기간별 수익률 조회 실패 - 계좌 ID: {}, 기간: {}, 에러: {}", 
               accountId, period, e.getMessage(), e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }
   
   
}