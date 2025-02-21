package com.crypto.trading.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.entity.Board;

//BoardRepository.java - 게시글 데이터 액세스를 위한 리포지토리
public interface BoardRepository extends JpaRepository<Board, Long> {
	// 게시글 목록을 생성일시 기준 내림차순(최신순)으로 조회
	List<Board> findAllByOrderByCreatedAtDesc();  
	
	// 특정 사용자가 작성한 게시글 목록 조회
	List<Board> findByUser_Username(String username);
}