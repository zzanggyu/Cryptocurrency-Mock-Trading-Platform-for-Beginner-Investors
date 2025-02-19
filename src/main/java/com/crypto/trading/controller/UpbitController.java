package com.crypto.trading.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.CoinPrice;
import com.crypto.trading.dto.MarketCode;
import com.crypto.trading.service.UpbitService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/upbit")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") 
public class UpbitController {
    private final UpbitService upbitService;
    
    // 기존 단일 코인 가격 조회
    @GetMapping("/price")
    public CoinPrice getCoinPrice(@RequestParam("market") String market) {
        return upbitService.getCoinPrice(market);
    }
    
    // 전체 코인 가격 조회 엔드포인트 추가
    @GetMapping("/prices")
    public List<CoinPrice> getAllPrices() {
        return upbitService.getAllCoinPrices();
    }
    
    // 마켓 정보 조회 엔드포인트 추가
    @GetMapping("/markets")
    public List<MarketCode> getAllMarkets() {
        return upbitService.getAllMarkets();
    }
    
}