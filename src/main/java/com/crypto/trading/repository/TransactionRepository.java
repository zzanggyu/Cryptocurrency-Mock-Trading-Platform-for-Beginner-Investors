package com.crypto.trading.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.crypto.trading.dto.CoinSummaryDTO;
import com.crypto.trading.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
   
   // 계좌ID로 모든 거래내역 조회 (최신순)
   List<Transaction> findByAccountIdOrderByTransactionDateTimeDesc(Long accountId);
   
   // 계좌ID와 코인심볼로 거래내역 조회
   List<Transaction> findByAccountIdAndCoinSymbol(Long accountId, String coinSymbol);
   
   // 특정 기간 거래내역 조회
   @Query("SELECT t FROM Transaction t " +
          "WHERE t.account.id = :accountId " +
          "AND t.transactionDateTime BETWEEN :startDate AND :endDate " +
          "ORDER BY t.transactionDateTime DESC")
   List<Transaction> findByAccountIdAndDateRange(
       @Param("accountId") Long accountId,
       @Param("startDate") LocalDateTime startDate,
       @Param("endDate") LocalDateTime endDate
   );
   
   // 코인별 거래 summary 조회 
   // TransactionRepository.java
   @Query("SELECT new com.crypto.trading.dto.CoinSummaryDTO(" +
		    "t.coinSymbol, " +
		    // 1. 순보유수량 (유지)
		    "CAST(SUM(CASE WHEN t.type = 'BUY' THEN t.quantity ELSE -t.quantity END) AS double), " +
		    // 2. 가중평균매수가 (유지)
		    "CAST(SUM(CASE WHEN t.type = 'BUY' THEN t.price * t.quantity END) / " +
		    "     SUM(CASE WHEN t.type = 'BUY' THEN t.quantity END) AS double), " +
		    // 3. 총매수금액 (수정) - 가중평균매수가 × 현재보유수량으로 변경
		    "CAST((SUM(CASE WHEN t.type = 'BUY' THEN t.price * t.quantity END) / " +
		    "      SUM(CASE WHEN t.type = 'BUY' THEN t.quantity END)) * " +
		    "     SUM(CASE WHEN t.type = 'BUY' THEN t.quantity ELSE -t.quantity END) AS double)) " +
		    "FROM Transaction t " +
		    "WHERE t.account.id = :accountId " +
		    "GROUP BY t.coinSymbol " +
		    "HAVING SUM(CASE WHEN t.type = 'BUY' THEN t.quantity ELSE -t.quantity END) > 0")
		List<CoinSummaryDTO> getCoinSummaryByAccountId(@Param("accountId") Long accountId);
   // 특정 코인의 최근 거래내역
   List<Transaction> findTop5ByCoinSymbolOrderByTransactionDateTimeDesc(String coinSymbol);

   // 특정 계좌의 특정 코인 총 매수 금액
   @Query("SELECT SUM(CASE WHEN t.type = 'BUY' THEN t.amount ELSE 0 END) " +
          "FROM Transaction t " +
          "WHERE t.account.id = :accountId AND t.coinSymbol = :coinSymbol")
   Double getTotalBuyAmountForCoin(
       @Param("accountId") Long accountId, 
       @Param("coinSymbol") String coinSymbol
   );

   // 특정 계좌의 특정 코인 총 매도 금액  
   @Query("SELECT SUM(CASE WHEN t.type = 'SELL' THEN t.amount ELSE 0 END) " +
          "FROM Transaction t " +
          "WHERE t.account.id = :accountId AND t.coinSymbol = :coinSymbol")
   Double getTotalSellAmountForCoin(
       @Param("accountId") Long accountId, 
       @Param("coinSymbol") String coinSymbol
   );

   // 특정 코인의 현재 보유수량
   @Query("SELECT SUM(CASE WHEN t.type = 'BUY' THEN t.quantity ELSE -t.quantity END) " +
          "FROM Transaction t " +
          "WHERE t.account.id = :accountId AND t.coinSymbol = :coinSymbol")
   Double getCurrentQuantityForCoin(
       @Param("accountId") Long accountId, 
       @Param("coinSymbol") String coinSymbol
   );
}