package com.crypto.trading.controller;

import com.crypto.trading.domain.User;
import com.crypto.trading.dto.LoginRequestDto;
import com.crypto.trading.dto.LoginResponseDto;
import com.crypto.trading.dto.SignUpRequestDto;
import com.crypto.trading.dto.ErrorResponseDto;
import com.crypto.trading.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequestDto signUpRequestDto) {
        try {
            User user = userService.signup(signUpRequestDto);
            return ResponseEntity.ok().body("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(new ErrorResponseDto(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        try {
            LoginResponseDto response = userService.login(loginRequestDto);
            System.out.println("Login Response: " + response); // 로그 추가
            return ResponseEntity.ok(response);
        } catch (Exception e) {
        	System.out.println("Login Error: " + e.getMessage()); // 로그 추가
            return ResponseEntity
                .badRequest()
                .body(new ErrorResponseDto(e.getMessage()));
        }
    }

    // 현재 로그인한 사용자 정보 조회
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(name = "Authorization") String token) {  // name 속성 추가
        try {
            String jwtToken = token.substring(7);
            User user = userService.findByUsername(jwtToken);  // 여기도 문제가 있네요
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(new ErrorResponseDto(e.getMessage()));
        }
    }
}