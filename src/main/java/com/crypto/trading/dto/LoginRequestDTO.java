package com.crypto.trading.dto;

import lombok.Getter;
import lombok.Setter;

//LoginRequestDTO.java - 로그인 요청 데이터 전송 객체
@Getter @Setter
public class LoginRequestDTO {
	private String username;     // 사용자 아이디
	private String password;     // 비밀번호
}