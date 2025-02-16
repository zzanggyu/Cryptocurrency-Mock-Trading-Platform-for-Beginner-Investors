package com.crypto.trading.service;

import com.crypto.trading.domain.News;
import com.crypto.trading.domain.User;
import com.crypto.trading.repository.NewsRepository;
import com.crypto.trading.repository.UserRepository;
import com.crypto.trading.config.JwtUtil;
import com.crypto.trading.dto.LoginRequestDto;
import com.crypto.trading.dto.SignUpRequestDto;
import com.crypto.trading.dto.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 회원가입
    @Transactional
    public User signup(SignUpRequestDto signUpRequestDto) {
        // 중복 검사
        if (userRepository.existsByUsername(signUpRequestDto.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userRepository.existsByEmail(signUpRequestDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 새 사용자 생성
        User user = new User();
        user.setUsername(signUpRequestDto.getUsername());
        user.setEmail(signUpRequestDto.getEmail());
        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(signUpRequestDto.getPassword()));

        return userRepository.save(user);
    }

    // 로그인
    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        // 사용자 찾기
        User user = userRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtUtil.createToken(user.getUsername());
        
        return new LoginResponseDto(token, user.getUsername());
    }

    // 사용자 정보 조회
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
    }
    
}