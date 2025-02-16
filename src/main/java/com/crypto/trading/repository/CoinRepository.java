package com.crypto.trading.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.crypto.trading.domain.Coin;

public interface CoinRepository extends JpaRepository<Coin, Long> {
	// title로 코인 조회 메서드
	@Query(value = "SELECT * FROM coin ORDER BY CAST(REPLACE(change_percent, '%', '') AS DECIMAL(10,2)) DESC", nativeQuery = true)
	List<Coin> findAllOrderByChangePercentDesc();
	
	// title로 코인 찾기
    Coin findByTitle(String title); 
}