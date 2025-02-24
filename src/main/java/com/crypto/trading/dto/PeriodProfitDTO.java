package com.crypto.trading.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PeriodProfitDTO {
    private double totalProfit;        // 기간 내 총 손익
    private double totalProfitRate;    // 기간 내 수익률
    private List<DailyProfitDTO> dailyProfits;  // 일별 손익 내역
}

