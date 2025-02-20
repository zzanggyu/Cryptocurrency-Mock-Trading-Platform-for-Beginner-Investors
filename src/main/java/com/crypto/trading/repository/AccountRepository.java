package com.crypto.trading.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.crypto.trading.entity.Account;
import com.crypto.trading.entity.Account.RiskLevel;
import com.crypto.trading.entity.User;

public interface AccountRepository extends JpaRepository<Account, Long> {
    
	
    Optional<Account> findByUserAndAccountNumber(User user, String accountNumber);
	
    // 계좌번호로 계좌 찾기
    Optional<Account> findByAccountNumber(String accountNumber);
    
    // 사용자 ID로 모든 계좌 찾기
 // userId(Long)로 계좌 찾기
    @Query("SELECT a FROM Account a WHERE a.user.userid = :userid")
    List<Account> findByUserId(@Param("userid") Long userid);
    
    // JPQL을 사용한 사용자의 총 계좌 잔액 조회
    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.user.userid = :userid")
    Optional<BigDecimal> getTotalBalanceByUserId(@Param("userid") Long userid);

    
    // 특정 위험도의 계좌 목록 조회
    List<Account> findByRiskLevel(RiskLevel riskLevel);
    
    // 계좌 존재 여부 확인
    boolean existsByAccountNumber(String accountNumber);
    
    Optional<Account> findByUser(User user);
    
    
}