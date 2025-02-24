package com.crypto.trading.dto;

import lombok.Data;

@Data
public class CoinPrice {
    private String market;              // 마켓 코드 (예: KRW-BTC)
    private Double trade_price;         // 현재가
    private Double opening_price;       // 시가
    private Double high_price;          // 고가
    private Double low_price;           // 저가
    private Double trade_volume;        // 거래량
    private Double acc_trade_price;     // 누적 거래대금
    private Double acc_trade_volume;    // 누적 거래량
    private String change;              // EVEN(보합), RISE(상승), FALL(하락)
    private Double change_rate;         // 변화율
    private Double change_price;        // 변화금액
    private Long timestamp;             // 타임스탬프
}