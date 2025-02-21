package com.crypto.trading.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.entity.Comment;

//CommentRepository.java - 댓글 데이터 액세스를 위한 리포지토리 
public interface CommentRepository extends JpaRepository<Comment, Long> {
	// 특정 게시글의 댓글 목록을 생성일시 기준 내림차순(최신순)으로 조회
	List<Comment> findByBoardIdOrderByCreatedAtDesc(Long id);
}
