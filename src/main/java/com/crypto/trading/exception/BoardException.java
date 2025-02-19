package com.crypto.trading.exception;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.crypto.trading.entity.Board;
import com.crypto.trading.entity.Comment;
import com.crypto.trading.entity.User;

@Component
public class BoardException {
	public static Board validateBoard(Optional<Board> board) {
		return board.orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
	}
	
	public static void validateUser(String postUser, String nowUser) {
		if(!postUser.equals(nowUser)) {
			throw new RuntimeException("권한이 없습니다.");
		}
	}
	
	public static User validateLoginUser(Optional<User> user) {
	       return user.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
	   }
	public static Comment validateComment(Optional<Comment> comment) {
		return comment.orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
	}
}
