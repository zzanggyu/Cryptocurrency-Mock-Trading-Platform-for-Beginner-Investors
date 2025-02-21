package com.crypto.trading.dto;

import com.crypto.trading.entity.User;

import lombok.Getter;
import lombok.Setter;

//UserResponseDTO.java - 사용자 정보 응답 데이터 전송 객체
@Getter @Setter
public class UserResponseDTO {
	private Long userId;        // 사용자 고유 ID
	private String username;    // 사용자 아이디
	private String nickname;    // 사용자 닉네임
	private String email;       // 이메일
	private String style;       // 투자 성향
	
	// User 엔티티를 DTO로 변환하는 정적 메서드
	public static UserResponseDTO from(User user) {
	    UserResponseDTO dto = new UserResponseDTO();
	    dto.setUserId(user.getUserId());
	    dto.setUsername(user.getUsername());
	    dto.setEmail(user.getEmail());
	    dto.setStyle(user.getStyle());
	    dto.setNickname(user.getNickname());
	    return dto;
	}
}