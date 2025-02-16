package com.crypto.trading.repository;  // 기존 패키지와 동일한 위치

import com.crypto.trading.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 사용자 이름으로 사용자 찾기
    Optional<User> findByUsername(String username);
    
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);
    
    // 사용자 이름이 이미 존재하는지 확인
    boolean existsByUsername(String username);
    
    // 이메일이 이미 존재하는지 확인
    boolean existsByEmail(String email);
}