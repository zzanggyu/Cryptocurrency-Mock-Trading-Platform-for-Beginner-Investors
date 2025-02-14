package com.crypto.trading.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MarketController {
	RestTemplate restTemplate = new RestTemplate();
	
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
	
}
