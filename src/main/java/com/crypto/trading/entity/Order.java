package com.crypto.trading.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @JsonIgnore  // 🔥 무한 루프 방지
    private Account account;

    @Column(nullable = false)
    private String coinSymbol;

    @Column(nullable = false)
    private BigDecimal targetPrice;  // 지정가

    @Column(nullable = false)
    private BigDecimal quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;  // BUY, SELL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;  // PENDING, COMPLETED, CANCELLED

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum OrderType {
        BUY,    // 매수
        SELL    // 매도
    }

    public enum OrderStatus {
        PENDING,    // 대기
        COMPLETED,  // 체결완료
        CANCELLED   // 취소됨
    }
    
    // cancel 메소드 추가
    public void cancel() {
        if (this.status != OrderStatus.PENDING) {
            throw new IllegalStateException("대기 상태인 주문만 취소할 수 있습니다.");
        }
        this.status = OrderStatus.CANCELLED;
        this.completedAt = LocalDateTime.now();
    }

    // 상태 검증 메소드 추가
    public boolean canCancel() {
        return this.status == OrderStatus.PENDING;
    }

    // JSON 직렬화 시 LazyLoading 이슈 방지를 위한 메소드
    @JsonIgnore
    public Account getAccount() {
        return account;
    }

    // 필요한 getter 메소드만 추가
    public Long getAccountId() {
        return account != null ? account.getId() : null;
    }
    
    
}