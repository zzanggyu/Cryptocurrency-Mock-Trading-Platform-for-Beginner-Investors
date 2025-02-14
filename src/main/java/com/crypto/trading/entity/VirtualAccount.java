package com.crypto.trading.entity;

import java.math.BigDecimal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "virtual_account")
public class VirtualAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(precision = 20, scale = 8)
    private BigDecimal balance;

    @Column(name = "plus_rate", precision = 20, scale = 8)
    private BigDecimal plusRate;

    public VirtualAccount(User user) {
        this.user = user;
        this.balance = new BigDecimal("1000000"); // 초기 백만원 지급
        this.plusRate = BigDecimal.ZERO;
    }
}