package com.crypto.trading.dto;


import java.math.BigDecimal;

import com.crypto.trading.entity.Transaction.TransactionType;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter
public class TransactionCreateRequest {
    @NotNull(message = "계좌 ID는 필수입니다")
    private Long accountId;
    
    @NotBlank(message = "코인 심볼은 필수입니다")
    private String coinSymbol;
    
    private BigDecimal amount;  // 시장가 매수시 사용할 금액
    
    private BigDecimal price;   // 체결 가격
    
    private BigDecimal quantity;  // 수량
    
    @NotNull(message = "거래 유형은 필수입니다")
    private TransactionType type;
    
    private boolean marketPrice;  // 시장가 여부
}