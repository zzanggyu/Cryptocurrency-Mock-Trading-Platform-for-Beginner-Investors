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
public class FavoritedId implements Serializable { //ID를 복합키로 쓰기 위한 클래스
	private Long user;
	private String symbol;
}
