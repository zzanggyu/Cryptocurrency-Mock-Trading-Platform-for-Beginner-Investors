package com.crypto.trading.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinSummaryDTO {
    private String coinSymbol;
    private BigDecimal totalQuantity;
    private BigDecimal avgBuyPrice;
    private BigDecimal currentPrice;
    private BigDecimal totalBuyAmount;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private BigDecimal profitLossRate;

    // JPQL 쿼리 결과를 매핑하기 위한 생성자
    public CoinSummaryDTO(String coinSymbol, Double totalQuantity, Double avgBuyPrice, Double totalBuyAmount) {
        this.coinSymbol = coinSymbol;
        this.totalQuantity = totalQuantity != null ? BigDecimal.valueOf(totalQuantity) : BigDecimal.ZERO;
        this.avgBuyPrice = avgBuyPrice != null ? BigDecimal.valueOf(avgBuyPrice) : BigDecimal.ZERO;
        this.totalBuyAmount = totalBuyAmount != null ? BigDecimal.valueOf(totalBuyAmount) : BigDecimal.ZERO;
    }
}