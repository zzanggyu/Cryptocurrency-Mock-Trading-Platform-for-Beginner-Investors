package com.crypto.trading.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    
    @Column(nullable = false)
    private String accountNumber;
    
    // userId를 User 엔티티 참조로 변경
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private BigDecimal balance;
    
    @Column(nullable = false)
    private BigDecimal investmentLimit;
    
    @Column(nullable = false)
    private BigDecimal investmentAmount;
    
    // RiskLevel은 User의 style과 연동
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
}