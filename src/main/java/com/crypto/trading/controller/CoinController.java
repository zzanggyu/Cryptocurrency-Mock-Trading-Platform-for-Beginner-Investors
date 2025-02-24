package com.crypto.trading.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.entity.Coin;
import com.crypto.trading.repository.CoinRepository;

@RestController
@RequestMapping("/api/coins")
public class CoinController {
    @Autowired
    private CoinRepository coinRepository;

    @PostMapping
    public ResponseEntity<String> saveCoins(@RequestBody List<Coin> coins) {
        for (Coin coin : coins) {
            Coin existingCoin = coinRepository.findByTitle(coin.getTitle());
            if (existingCoin != null) {
                existingCoin.setChangePercent(coin.getChangePercent());
                existingCoin.setCreatedAt(coin.getCreatedAt());
                coinRepository.save(existingCoin);
            } else {
                coinRepository.save(coin);
            }
        }
        return ResponseEntity.ok("데이터 저장 성공");
    }

    @GetMapping
    public List<Coin> getAllCoins() {
        // findAll() 대신 정렬된 데이터를 가져오는 메서드 사용
        return coinRepository.findAllOrderByChangePercentDesc();
    }
}