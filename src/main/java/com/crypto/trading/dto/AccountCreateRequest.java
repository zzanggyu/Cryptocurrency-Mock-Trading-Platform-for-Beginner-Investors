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
    @NotNull(message = "사용자 ID는 필수입니다")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "사용자 ID는 영문자와 숫자만 포함할 수 있습니다")
    private String userId; 
    
    @NotNull(message = "초기 잔액은 필수입니다")
    @DecimalMin(value = "0.0", message = "잔액은 0 이상이어야 합니다")
    private BigDecimal initialBalance;  // balance -> initialBalance로 변경
    
//    @NotNull(message = "투자 한도는 필수입니다")
//    @DecimalMin(value = "0.0", message = "투자 한도는 0 이상이어야 합니다")
//    private BigDecimal investmentLimit;
    
    @NotNull(message = "위험 수준은 필수입니다")
    private RiskLevel riskLevel;
}