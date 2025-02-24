// OrderResponse.java
package com.crypto.trading.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.crypto.trading.entity.Order;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderResponse {
    private Long id;
    private String coinSymbol;
    private BigDecimal targetPrice;
    private BigDecimal quantity;
    private Order.OrderType type;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .coinSymbol(order.getCoinSymbol())
                .targetPrice(order.getTargetPrice())
                .quantity(order.getQuantity())
                .type(order.getType())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .completedAt(order.getCompletedAt())
                .build();
    }
}