package com.crypto.trading.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.entity.Asset;

public interface AssetRepository extends JpaRepository<Asset, Long> {
	Asset findByName(String name);
}