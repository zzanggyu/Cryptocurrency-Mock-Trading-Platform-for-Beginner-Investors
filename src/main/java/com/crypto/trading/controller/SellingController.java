package com.crypto.trading.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.entity.Selling;
import com.crypto.trading.repository.SellingRepository;

@RestController
@RequestMapping("/api/selling")
public class SellingController {

   private final SellingRepository sellingRepository;

   public SellingController(SellingRepository sellingRepository) {
       this.sellingRepository = sellingRepository;
   }

   @PostMapping
   public ResponseEntity<String> saveSellingRank(@RequestBody List<Selling> sellingList) {
       try {
           // 기존 데이터 삭제
           sellingRepository.deleteAll();
           // 새 데이터 저장
           sellingRepository.saveAll(sellingList);
           return ResponseEntity.ok("Selling rank data updated successfully!");
       } catch (Exception e) {
           return ResponseEntity.internalServerError().body("Error saving selling rank: " + e.getMessage());
       }
   }

   @GetMapping
   public ResponseEntity<List<Selling>> getAllSellingRank() {
       List<Selling> sellingList = sellingRepository.findAll();
       return ResponseEntity.ok(sellingList);
   }

   @GetMapping("/{id}")
   public ResponseEntity<Selling> getSellingById(@PathVariable Long id) {
       return sellingRepository.findById(id)
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
   }
}
