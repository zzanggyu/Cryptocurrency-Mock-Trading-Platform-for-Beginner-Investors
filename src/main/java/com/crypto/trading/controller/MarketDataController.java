package com.crypto.trading.controller;



import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.entity.Market;
import com.crypto.trading.repository.MarketRepository;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")  // CORS 설정 추가
@RequestMapping("/api/markets")
@RequiredArgsConstructor  // 생성자 자동 생성
public class MarketDataController {

   private final MarketRepository marketRepository;

//   public MarketDataController(MarketRepository marketRepository) {
//       this.marketRepository = marketRepository;
//   }

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
