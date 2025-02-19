package com.crypto.trading.dto;

import lombok.Data;

@Data
public class MarketCode {
    private String market;          // 업비트에서 제공하는 시장 코드 (ex. KRW-BTC)
    private String korean_name;     // 한글 이름
    private String english_name;    // 영문 이름
    private String market_warning;  // 유의 종목 여부
}