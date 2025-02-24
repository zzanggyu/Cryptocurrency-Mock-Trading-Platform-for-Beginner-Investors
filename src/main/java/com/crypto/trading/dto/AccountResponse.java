package com.crypto.trading.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.crypto.trading.entity.Account.RiskLevel;

import lombok.Getter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private String userId;
    private BigDecimal balance;
    private BigDecimal investmentLimit;
    private BigDecimal investmentAmount;
    private String riskLevel;  // RiskLevel enum 대신 String으로 변경
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal profit_rate;
}