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
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupDTO userDto) {
        try {
            return ResponseEntity.ok(userService.signup(userDto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginDto, HttpSession session) {
        try {
            UserResponseDTO user = userService.login(loginDto);
            // 세션에 사용자 정보 저장 전 로그
            System.out.println("로그인 시도 사용자: " + user.getUsername());
            
            // 세션에 사용자 정보 저장
            session.setAttribute("LOGGED_IN_USER", user);
            
            // 세션 저장 후 확인 로그
            System.out.println("세션 ID (로그인): " + session.getId());
            System.out.println("세션에 저장된 사용자: " + ((UserResponseDTO)session.getAttribute("LOGGED_IN_USER")).getUsername());
            
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/user/info")
    public ResponseEntity<?> getUserInfo(HttpSession session) {
        System.out.println("세션 ID (정보조회): " + session.getId());
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        System.out.println("세션에서 가져온 사용자: " + (user != null ? user.getUsername() : "null"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(userService.getUserInfo(user.getUsername()));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        
        return ResponseEntity.ok().body("로그아웃 완료");
    }
    
    @PutMapping("/user/password")
    public ResponseEntity<?> changePassword(
        @RequestBody PasswordChangeDTO passwordDto,
        HttpSession session
    ) {
        // 세션 디버깅 로그 추가
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
    
    @PutMapping("user/style")
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
    
    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpSession session) {
    	UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
    	if(user == null) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(user);
    }    
    
    @PutMapping("user/nickname")
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