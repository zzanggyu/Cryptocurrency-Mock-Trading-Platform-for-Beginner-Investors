package com.crypto.trading.controller;

import com.crypto.trading.domain.Buying;
import com.crypto.trading.repository.BuyingRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buying")
public class BuyingController {

    private final BuyingRepository buyingRepository;

    public BuyingController(BuyingRepository buyingRepository) {
        this.buyingRepository = buyingRepository;
    }

    @PostMapping
    public ResponseEntity<String> saveBuyingRank(@RequestBody List<Buying> buyingList) {
        try {
            // 기존 데이터 삭제
            buyingRepository.deleteAll();
            // 새 데이터 저장
            buyingRepository.saveAll(buyingList);
            return ResponseEntity.ok("Buying rank data updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving buying rank: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Buying>> getAllBuyingRank() {
        List<Buying> buyingList = buyingRepository.findAll();
        return ResponseEntity.ok(buyingList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Buying> getBuyingById(@PathVariable Long id) {
        return buyingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}