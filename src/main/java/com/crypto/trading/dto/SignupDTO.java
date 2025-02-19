package com.crypto.trading.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SignupDTO {
    private String username;
    private String nickname;
    private String email;
    private String password;
    private BigDecimal initialBalance; // 추가: 초기 계좌 잔액
}