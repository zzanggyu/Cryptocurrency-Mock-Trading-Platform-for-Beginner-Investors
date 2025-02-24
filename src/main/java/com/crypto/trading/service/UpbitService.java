package com.crypto.trading.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.crypto.trading.dto.CoinPrice;
import com.crypto.trading.dto.MarketCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UpbitService {
    private static final String UPBIT_API_URL = "https://api.upbit.com/v1";
    private final WebClient webClient;
    
    // 모든 마켓 정보 조회
    public List<MarketCode> getAllMarkets() {
        try {
            return webClient.get()
                .uri(UPBIT_API_URL + "/market/all?isDetails=false")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<MarketCode>>() {})
                .block()
                .stream()
                .filter(market -> market.getMarket().startsWith("KRW-"))  // KRW 마켓만 필터링
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("마켓 조회 중 오류: {}", e.getMessage());
            throw new RuntimeException("마켓 조회 중 오류가 발생했습니다.", e);
        }
    }

    // 모든 코인 가격 조회
    public List<CoinPrice> getAllCoinPrices() {
        try {
            List<MarketCode> markets = getAllMarkets();
            String marketCodes = markets.stream()
                .map(MarketCode::getMarket)
                .collect(Collectors.joining(","));

            return webClient.get()
                .uri(UPBIT_API_URL + "/ticker?markets=" + marketCodes)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<CoinPrice>>() {})
                .block();
        } catch (Exception e) {
            log.error("전체 코인 시세 조회 중 오류: {}", e.getMessage());
            throw new RuntimeException("전체 시세 조회 중 오류가 발생했습니다.", e);
        }
    }

    public CoinPrice getCoinPrice(String market) {
        try {
            List<CoinPrice> prices = webClient.get()
                .uri(UPBIT_API_URL + "/ticker?markets=" + market)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<CoinPrice>>() {})
                .block();
            
            if (prices != null && !prices.isEmpty()) {
                return prices.get(0);
            }
            throw new RuntimeException("가격 정보를 찾을 수 없습니다.");
        } catch (Exception e) {
            log.error("업비트 API 호출 중 오류: {}", e.getMessage());
            throw new RuntimeException("시세 조회 중 오류가 발생했습니다.", e);
        }
    }

    public Double calculateQuantity(Double price, String market) {
        CoinPrice coinPrice = getCoinPrice(market);
        return price / coinPrice.getTrade_price();
    }

    public Double calculatePrice(Double quantity, String market) {
        CoinPrice coinPrice = getCoinPrice(market);
        return quantity * coinPrice.getTrade_price();
    }
}