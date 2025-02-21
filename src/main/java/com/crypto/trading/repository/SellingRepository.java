package com.crypto.trading.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.entity.Selling;

public interface SellingRepository extends JpaRepository<Selling, Long> {
   Selling findByTitle(String title);
}