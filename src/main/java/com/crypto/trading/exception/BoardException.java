package com.crypto.trading.exception;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.crypto.trading.entity.Board;
import com.crypto.trading.entity.Comment;
import com.crypto.trading.entity.User;

//BoardException.java - 게시판 관련 예외 처리를 위한 유틸리티 클래스
@Component
public class BoardException {
	// 게시글 존재 여부 검증
	public static Board validateBoard(Optional<Board> board) {
	    return board.orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
	}
	
	// 게시글/댓글 작성자와 현재 사용자가 같은지 검증 (권한 체크)
	public static void validateUser(String postUser, String nowUser) {
	    if(!postUser.equals(nowUser)) {
	        throw new RuntimeException("권한이 없습니다.");
	    }
	}
	
	// 로그인한 사용자의 존재 여부 검증
	public static User validateLoginUser(Optional<User> user) {
	    return user.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
	}
	
	// 댓글 존재 여부 검증
	public static Comment validateComment(Optional<Comment> comment) {
	    return comment.orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
	}
}