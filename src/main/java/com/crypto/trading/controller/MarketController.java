package com.crypto.trading.controller;

import com.crypto.trading.domain.Market;
import com.crypto.trading.repository.MarketRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
public class MarketController {

   private final MarketRepository marketRepository;

   public MarketController(MarketRepository marketRepository) {
       this.marketRepository = marketRepository;
   }

   @PostMapping
   public ResponseEntity<String> saveMarkets(@RequestBody List<Market> markets) {
       // 기존 데이터 삭제
       marketRepository.deleteAll();
       // 새 데이터 저장
       marketRepository.saveAll(markets);
       return ResponseEntity.ok("Markets data updated successfully!");
   }

   @GetMapping
   public ResponseEntity<List<Market>> getAllMarkets() {
       List<Market> markets = marketRepository.findAll();
       return ResponseEntity.ok(markets);
   }

   @GetMapping("/{id}")
   public ResponseEntity<Market> getMarketById(@PathVariable Long id) {
       return marketRepository.findById(id)
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
   }
}