package com.crypto.trading.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String accountNumber;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", nullable = false)
    private User user;
    
//    @Column(nullable = false, precision = 20, scale = 8)
//    private BigDecimal balance;
    
    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal balance = BigDecimal.ZERO;  // 기본값 설정
    
    @Column(nullable = false)
    private BigDecimal investmentLimit;
    
    @Column(nullable = false)
    private BigDecimal investmentAmount;
    
    // 수익률 추가
    @Column(name = "profit_rate", precision = 20, scale = 8)
    private BigDecimal profitRate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel;
    
    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Transaction> transactions = new ArrayList<>();
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        investmentAmount = BigDecimal.ZERO;
        profitRate = BigDecimal.ZERO;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
   
    public enum RiskLevel {
        CONSERVATIVE,
        MODERATELY_CONSERVATIVE,
        MODERATE,
        MODERATELY_AGGRESSIVE,
        AGGRESSIVE
    }

    public void decreaseBalance(BigDecimal amount) {
        if (this.balance.compareTo(amount) < 0) {
            throw new IllegalStateException("잔액이 부족합니다");
        }
        this.balance = this.balance.subtract(amount);
    }

    public void increaseBalance(BigDecimal amount) {
        this.balance = this.balance.add(amount);
    }
    
    public void increaseInvestmentAmount(BigDecimal amount) {
        this.investmentAmount = this.investmentAmount.add(amount);
    }

    public void decreaseInvestmentAmount(BigDecimal amount) {
        this.investmentAmount = this.investmentAmount.subtract(amount);
    }
    
    // 수익률 업데이트 메서드 추가
    public void updateProfitRate(BigDecimal newProfitRate) {
        this.profitRate = newProfitRate;
    }
}