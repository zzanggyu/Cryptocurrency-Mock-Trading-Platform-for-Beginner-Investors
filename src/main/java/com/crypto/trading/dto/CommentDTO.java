package com.crypto.trading.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

//CommentDTO.java - 댓글 데이터 전송 객체
@Getter @Setter
public class CommentDTO {
	private Long id;                     // 댓글 ID
	private String content;              // 댓글 내용
	private String username;             // 작성자 아이디
	private String nickname;             // 작성자 닉네임
	private LocalDateTime createdAt;     // 작성일시
	private boolean isAuthor;            // 현재 사용자가 작성자인지 여부
}