package com.crypto.trading.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.LoginRequestDTO;
import com.crypto.trading.dto.PasswordChangeDTO;
import com.crypto.trading.dto.SignupDTO;
import com.crypto.trading.dto.StyleDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")  // 기본 URL 경로 설정
@RequiredArgsConstructor  // 생성자 주입을 위한 롬복 어노테이션
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  
public class UserController {
    private final UserService userService;  // 사용자 관련 비즈니스 로직 처리 서비스

    @PostMapping("/signup")  // 회원가입 요청 처리
    public ResponseEntity<?> signup(@RequestBody SignupDTO userDto) {
        try {
            return ResponseEntity.ok(userService.signup(userDto));  // 회원가입 성공 시 사용자 정보 반환
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());  // 실패 시 에러 메시지 반환
        }
    }

    @PostMapping("/login")  // 로그인 요청 처리
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginDto, HttpSession session) {
        try {
            UserResponseDTO user = userService.login(loginDto);
            System.out.println("로그인 시도 사용자: " + user.getUsername());  // 로그인 시도 로그
            
            session.setAttribute("LOGGED_IN_USER", user);  // 세션에 사용자 정보 저장
            
            // 세션 저장 확인 로그
            System.out.println("세션 ID (로그인): " + session.getId());
            System.out.println("세션에 저장된 사용자: " + ((UserResponseDTO)session.getAttribute("LOGGED_IN_USER")).getUsername());
            
            return ResponseEntity.ok(user);  // 로그인 성공 시 사용자 정보 반환
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());  // 실패 시 에러 메시지 반환
        }
    }
    
    @GetMapping("/user/info")  // 사용자 정보 조회
    public ResponseEntity<?> getUserInfo(HttpSession session) {
        // 세션 정보 로그
        System.out.println("세션 ID (정보조회): " + session.getId());
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        System.out.println("세션에서 가져온 사용자: " + (user != null ? user.getUsername() : "null"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(userService.getUserInfo(user.getUsername()));
    }
    
    @PostMapping("/logout")  // 로그아웃 처리
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();  // 세션 무효화
        return ResponseEntity.ok().body("로그아웃 완료");
    }
    
    @PutMapping("/user/password")  // 비밀번호 변경
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDTO passwordDto, HttpSession session) {
        // 세션 디버깅 로그
        System.out.println("비밀번호 변경 요청 - 세션 ID: " + session.getId());
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        System.out.println("세션에서 가져온 사용자: " + (user != null ? user.getUsername() : "null"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        
        try {
            userService.changePassword(user.getUsername(), passwordDto);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("user/style")  // 투자 성향 업데이트
    public ResponseEntity<?> updateStyle(@RequestBody StyleDTO styleDto, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        
        try {
            userService.updateStyle(user.getUsername(), styleDto);
            return ResponseEntity.ok("투자 성향이 업데이트 되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/check-session")  // 세션 상태 확인
    public ResponseEntity<?> checkSession(HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(user);
    }    
    
    @PutMapping("user/nickname")  // 닉네임 변경
    public ResponseEntity<?> updateNickname(@RequestBody Map<String, String> request, HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        
        try {
            userService.updateNickname(user.getUsername(), request.get("nickname"));
            return ResponseEntity.ok("닉네임이 변경되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}