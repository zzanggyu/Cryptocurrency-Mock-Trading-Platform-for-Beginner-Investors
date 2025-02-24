package com.crypto.trading.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.entity.Order;
import com.crypto.trading.entity.Order.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 상태별 주문 조회
    @Query("SELECT o FROM Order o WHERE o.status = :status")
    List<Order> findByStatus(@Param("status") OrderStatus status);

    // 계좌별 주문 조회
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId")
    List<Order> findByAccountId(@Param("accountId") Long accountId);

    // 계좌별 상태별 주문 조회
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.status = :status")
    List<Order> findByAccountIdAndStatus(
        @Param("accountId") Long accountId,
        @Param("status") OrderStatus status
    );

    // 코인별 주문 조회
    @Query("SELECT o FROM Order o WHERE o.coinSymbol = :coinSymbol")
    List<Order> findByCoinSymbol(@Param("coinSymbol") String coinSymbol);

    // 계좌별 코인별 주문 조회
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.coinSymbol = :coinSymbol")
    List<Order> findByAccountIdAndCoinSymbol(
        @Param("accountId") Long accountId,
        @Param("coinSymbol") String coinSymbol
    );

    // 계좌별 코인별 상태별 주문 조회
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.coinSymbol = :coinSymbol AND o.status = :status")
    List<Order> findByAccountIdAndCoinSymbolAndStatus(
        @Param("accountId") Long accountId,
        @Param("coinSymbol") String coinSymbol,
        @Param("status") OrderStatus status
    );

    // 계좌별 대기 주문 조회
    @Query("SELECT o FROM Order o WHERE o.account.id = :accountId AND o.status = 'PENDING'")
    List<Order> findPendingOrdersByAccountId(@Param("accountId") Long accountId);
    
    // 사용자 이름으로 주문 삭제
    @Transactional
    void deleteByAccount_User_Username(String username);
}