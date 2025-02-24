package com.crypto.trading.dto;

import com.crypto.trading.entity.UserFavorite;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//FavoriteDTO.java - 즐겨찾기 데이터 전송 객체
@Getter @Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteDTO {
	private String symbol;       // 코인 심볼(예: BTC)
	private String coinName;     // 코인 이름(예: Bitcoin)
	
	public static FavoriteDTO from(UserFavorite favorite) {
        return new FavoriteDTO(
            favorite.getSymbol(),
            favorite.getCoinName()
        );
    }
}