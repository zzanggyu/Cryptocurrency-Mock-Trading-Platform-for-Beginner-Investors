package com.crypto.trading.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "favorites")
@IdClass(FavoritedId.class)             // 복합키 클래스 지정
public class UserFavorite {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)  // 다대일 관계: 한 사용자가 여러 코인 즐겨찾기 가능
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;                   // 사용자 정보
    
    @Id
    @Column(name = "symbol")
    private String symbol;               // 코인 심볈(예: BTC)
    @Column(name = "coin_name")
    private String coinName;             // 코인 이름(예: Bitcoin)
}