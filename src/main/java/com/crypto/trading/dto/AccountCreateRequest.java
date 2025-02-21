package com.crypto.trading.dto;

import java.math.BigDecimal;

import com.crypto.trading.entity.Account.RiskLevel;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountCreateRequest {
    @NotNull(message = "위험 수준은 필수입니다")
    private RiskLevel riskLevel;

    // userId는 컨트롤러에서 세션으로부터 설정
    private String userId;

    // 초기 잔액은 기본값 0으로 설정
    @NotNull(message = "초기 잔액은 필수입니다")
    @DecimalMin(value = "0.0", message = "잔액은 0 이상이어야 합니다")
    private BigDecimal initialBalance = BigDecimal.ZERO;
}