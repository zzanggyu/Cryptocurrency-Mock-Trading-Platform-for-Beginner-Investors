package com.crypto.trading.entity;


import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class FavoritedId implements Serializable { // 즐겨찾기의 복합키(사용자ID + 코인심볼) 구현을 위한 클래스
    private Long user;                   // 사용자 ID
    private String symbol;               // 코인 심볼
}
