package com.crypto.trading.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardDTO {
	private Long id;
	private String title;
	private String content;
	private String username;
	private String nickname;
	private int viewCount;
	private int likeCount;
	private LocalDateTime createdAt;
	private List<CommentDTO> comments;
	private boolean isAuthor;
}
