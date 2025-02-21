package com.crypto.trading.dto;

import lombok.Getter;
import lombok.Setter;

//FavoriteDTO.java - 즐겨찾기 데이터 전송 객체
@Getter @Setter
public class FavoriteDTO {
	private String symbol;       // 코인 심볼(예: BTC)
	private String coinName;     // 코인 이름(예: Bitcoin)
}