package com.crypto.trading.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "accounts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
     
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "username", nullable = false)
    private User user;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal investmentLimit = BigDecimal.ZERO;  // 기본값 설정

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal investmentAmount = BigDecimal.ZERO; // 기본값 설정

    @Column(name = "profit_rate", precision = 20, scale = 8)
    private BigDecimal profitRate = BigDecimal.ZERO;       // 기본값 설정

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel = RiskLevel.보통;  // 기본값 설정
    
    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference  // 여전히 관리되는 쪽에서는 이 어노테이션을 사용
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
        보수적,
        약간_보수적,
        보통,
        약간_공격적,
        공격적
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