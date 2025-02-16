package com.crypto.trading.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.domain.Market;

public interface MarketRepository extends JpaRepository<Market, Long> {
    Market findByName(String name);
}
