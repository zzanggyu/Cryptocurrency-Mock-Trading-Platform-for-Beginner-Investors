package com.crypto.trading.dto;

import lombok.Getter;
import lombok.Setter;


//PasswordChangeDTO.java - 비밀번호 변경 요청 데이터 전송 객체
@Getter @Setter
public class PasswordChangeDTO {
	private String postPassword;  // 현재 비밀번호
	private String newPassword;   // 새 비밀번호
}