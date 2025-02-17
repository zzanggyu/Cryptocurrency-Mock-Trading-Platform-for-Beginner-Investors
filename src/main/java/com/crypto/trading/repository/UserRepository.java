package com.crypto.trading.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.entity.User;

import java.util.Optional;

//UserRepository.java - 사용자 데이터 액세스를 위한 리포지토리
public interface UserRepository extends JpaRepository<User, Long> {
	// 사용자명으로 사용자 정보 조회
	Optional<User> findByUsername(String username);
	
	// 이메일로 사용자 정보 조회
	Optional<User> findByEmail(String email);
	
	// 닉네임으로 사용자 정보 조회
	Optional<User> findByNickname(String nickname);
	
	// 사용자명 존재 여부 확인
	boolean existsByUsername(String username);
	
	// 이메일 존재 여부 확인
	boolean existsByEmail(String email);
	
	// 닉네임 존재 여부 확인
	boolean existsByNickname(String nickname);
}