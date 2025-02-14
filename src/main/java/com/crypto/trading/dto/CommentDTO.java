package com.crypto.trading.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDTO {
	private Long id;
	private String content;
	private String username;
	private String nickname;
	private LocalDateTime createdAt;
	private boolean isAuthor;
}
