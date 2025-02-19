package com.crypto.trading.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.crypto.trading.entity.News;
import com.crypto.trading.service.NewsService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MarketController {
   RestTemplate restTemplate = new RestTemplate();  // HTTP 요청을 위한 RestTemplate 객체
   private final NewsService newsService;
   
   @GetMapping("/market/ticker")  // 코인 시세 조회
   public ResponseEntity<?> getMarketTicker() {
       try {
           // 업비트 API에서 BTC, ETH, XRP, SOL, TRX 코인의 시세 정보 조회
           String url = "https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-XRP,KRW-SOL,KRW-TRX";
           
           ResponseEntity<Object[]> response = restTemplate.getForEntity(url, Object[].class);
           System.out.println("Ticker Response: " + response.getBody());  // 응답 데이터 로그
           return ResponseEntity.ok(response.getBody());
       } catch (Exception e) {
           System.out.println("Ticker Error: " + e.getMessage());  // 에러 로그
           return ResponseEntity.badRequest().body("시세 조회 실패 : " + e.getMessage());
       }
   }
   
   @GetMapping("/market/news")
   public ResponseEntity<?> getLatestNews() {
       try {
           // 최신 뉴스 10개를 가져오도록 Pageable 설정
           Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "publishDate"));
           Page<News> newsPage = newsService.getAllNews(pageable);
           return ResponseEntity.ok(newsPage.getContent());
       } catch (Exception e) {
           return ResponseEntity.badRequest().body("뉴스 조회 실패: " + e.getMessage());
       }
   }
}