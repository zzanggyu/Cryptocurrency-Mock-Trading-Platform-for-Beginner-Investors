package com.crypto.trading.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.domain.Buying;

public interface BuyingRepository extends JpaRepository<Buying, Long> {
    Buying findByTitle(String title);
}
