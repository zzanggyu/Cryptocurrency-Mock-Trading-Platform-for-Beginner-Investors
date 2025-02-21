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
@Getter @Setter
@NoArgsConstructor
@Table(name = "virtual_account")
public class VirtualAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;              // 계좌 고유 ID

    @OneToOne                           // 일대일 관계: 사용자당 하나의 가상계좌
    @JoinColumn(name = "user_id")
    private User user;                   // 계좌 소유자

    @Column(precision = 20, scale = 8)
    private BigDecimal balance;          // 계좌 잔액(소수점 8자리까지)

    @Column(name = "plus_rate", precision = 20, scale = 8)
    private BigDecimal plusRate;         // 수익률(소수점 8자리까지)

    public VirtualAccount(User user) {   // 새 계좌 생성 시 초기화
        this.user = user;
        this.balance = new BigDecimal("1000000"); // 초기 백만원 지급
        this.plusRate = BigDecimal.ZERO;          // 초기 수익률 0%
    }
}