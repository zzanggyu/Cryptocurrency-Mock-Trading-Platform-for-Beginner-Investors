package com.crypto.trading.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DailyProfitDTO {
    private LocalDateTime date;
    private double profit;
    private double profitRate;
}