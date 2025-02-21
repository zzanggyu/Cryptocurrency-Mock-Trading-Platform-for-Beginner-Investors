package com.crypto.trading.dto;

import lombok.Getter;
import lombok.Setter;

//StyleDTO.java - 투자 성향 설정/변경 데이터 전송 객체
@Getter @Setter
public class StyleDTO {
	private String style;       // 투자 성향 (안정형, 중립형, 공격형 등)
	private int score;          // 투자 성향 설문 점수
}