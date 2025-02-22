package com.crypto.trading.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.crypto.trading.dto.NewsDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.service.NewsService;

import jakarta.servlet.http.HttpSession;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MarketController {
    private final NewsService newsService;
    private RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/market/ticker")
    public ResponseEntity<?> getMarketTicker() {
        try {
            String url = "https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-XRP,KRW-SOL,KRW-TRX";
            ResponseEntity<Object[]> response = restTemplate.getForEntity(url, Object[].class);
            System.out.println("Ticker Response: " + response.getBody());
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            System.out.println("Ticker Error: " + e.getMessage());
            return ResponseEntity.badRequest().body("시세 조회 실패 : " + e.getMessage());
        }
    }
   
    @GetMapping("/market/news")
    public ResponseEntity<?> getLatestNews(HttpSession session) {
        try {
            UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
            String username = user != null ? user.getUsername() : null;

            Pageable pageable = PageRequest.of(0, 7, Sort.by(Sort.Direction.DESC, "publishDate"));
            Page<NewsDTO> newsPage = newsService.getAllNews(pageable, username);
            System.out.println("뉴스 응답: " + newsPage.getContent());
            return ResponseEntity.ok(newsPage.getContent());
        } catch (Exception e) {
            System.out.println("News Error: " + e.getMessage());
            return ResponseEntity.badRequest().body("뉴스 조회 실패: " + e.getMessage());
        }
    }
}