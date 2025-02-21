package com.crypto.trading.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

//BoardDTO.java - 게시글 데이터 전송 객체
@Getter @Setter
public class BoardDTO {
	private Long id;                     // 게시글 ID
	private String title;                // 게시글 제목
	private String content;              // 게시글 내용
	private String username;             // 작성자 아이디
	private String nickname;             // 작성자 닉네임
	private int viewCount;               // 조회수
	private int likeCount;               // 좋아요 수
	private LocalDateTime createdAt;     // 작성일시
	private List<CommentDTO> comments;   // 댓글 목록
	private boolean isAuthor;            // 현재 사용자가 작성자인지 여부
}