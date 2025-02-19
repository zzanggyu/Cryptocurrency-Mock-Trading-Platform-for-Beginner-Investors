package com.crypto.trading.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.crypto.trading.entity.Transaction;
import com.crypto.trading.entity.Transaction.TransactionType;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TransactionResponse {
    private Long id;
    private String coinSymbol;
    private BigDecimal amount;
    private BigDecimal price;
    private BigDecimal quantity;
    private TransactionType type;
    private LocalDateTime transactionDateTime;

    public static TransactionResponse from(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .coinSymbol(transaction.getCoinSymbol())
                .amount(transaction.getAmount())
                .price(transaction.getPrice())
                .quantity(transaction.getQuantity())
                .type(transaction.getType())
                .transactionDateTime(transaction.getTransactionDateTime())
                .build();
    }
}