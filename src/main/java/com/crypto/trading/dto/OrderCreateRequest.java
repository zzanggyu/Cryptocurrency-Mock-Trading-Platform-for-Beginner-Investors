package com.crypto.trading.dto;

import java.math.BigDecimal;

import com.crypto.trading.entity.Order;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderCreateRequest {
    @NotNull(message = "계좌 ID는 필수입니다")
    private Long accountId;
    
    @NotBlank(message = "코인 심볼은 필수입니다")
    private String coinSymbol;
    
    @NotNull(message = "지정가는 필수입니다")
    @DecimalMin(value = "0.0", message = "지정가는 0 이상이어야 합니다")
    private BigDecimal targetPrice;
    
    @NotNull(message = "주문 수량은 필수입니다")
    @DecimalMin(value = "0.0", message = "주문 수량은 0 이상이어야 합니다")
    private BigDecimal quantity;
    
    @NotNull(message = "주문 유형은 필수입니다")
    private Order.OrderType type;  // Order.OrderType으로 수정
}