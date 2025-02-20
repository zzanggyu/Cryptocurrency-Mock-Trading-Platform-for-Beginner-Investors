package com.crypto.trading.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SignupDTO {
    private String username;
    private String nickname;
    private String email;
    private String password;
//    private BigDecimal initialBalance; // 추가: 초기 계좌 잔액
    @NotNull(message = "초기 금액은 필수입니다")
    @DecimalMin(value = "0.0", message = "초기 금액은 0 이상이어야 합니다")
    private BigDecimal initialBalance;
}