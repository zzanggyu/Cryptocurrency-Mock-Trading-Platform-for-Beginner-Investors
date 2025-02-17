package com.crypto.trading.dto;

import lombok.Getter;
import lombok.Setter;
//SignupDTO.java - 회원가입 요청 데이터 전송 객체
@Getter @Setter
public class SignupDTO {
	private String username;    // 사용자 아이디
	private String nickname;    // 사용자 닉네임 
	private String email;       // 이메일
	private String password;    // 비밀번호
}
