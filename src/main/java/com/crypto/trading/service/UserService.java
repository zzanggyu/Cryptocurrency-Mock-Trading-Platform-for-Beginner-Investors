package com.crypto.trading.service;

//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.config.BCryptEncoder;
import com.crypto.trading.dto.AccountCreateRequest;
import com.crypto.trading.dto.LoginRequestDTO;
import com.crypto.trading.dto.PasswordChangeDTO;
import com.crypto.trading.dto.SignupDTO;
import com.crypto.trading.dto.StyleDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.entity.Account;
import com.crypto.trading.entity.User;
import com.crypto.trading.repository.AccountRepository;
import com.crypto.trading.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;
    private final BCryptEncoder bCryptEncoder;

    public UserResponseDTO signup(SignupDTO signupDto) {
        // 중복 검사
        validateDuplicateUser(signupDto);

        // 사용자 엔티티 생성
        User user = new User();
        user.setUsername(signupDto.getUsername());
        user.setNickname(signupDto.getNickname());
        user.setEmail(signupDto.getEmail());
        user.setPassword(bCryptEncoder.encode(signupDto.getPassword()));
        user.setStyle("CONSERVATIVE"); // 기본 투자 성향 설정

        User savedUser = userRepository.save(user);

        // AccountService를 통해 계좌 생성 
        AccountCreateRequest accountRequest = new AccountCreateRequest();
        accountRequest.setUserId(savedUser.getUsername());
        accountRequest.setInitialBalance(signupDto.getInitialBalance()); // 사용자 입력 초기 잔액 사용
        accountService.createAccount(accountRequest);

        return UserResponseDTO.from(savedUser);
    }

    public UserResponseDTO login(LoginRequestDTO loginDto) {
        log.info("로그인 처리 시작 - 사용자명: {}", loginDto.getUsername());
        
        User user = userRepository.findByUsername(loginDto.getUsername())
            .orElseThrow(() -> {
                log.error("사용자 조회 실패 - 사용자명: {}", loginDto.getUsername());
                return new RuntimeException("사용자를 찾을 수 없습니다.");
            });

        log.info("사용자 조회 성공 - 사용자명: {}", user.getUsername());
        
        if (!bCryptEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            log.error("비밀번호 불일치 - 사용자명: {}", loginDto.getUsername());
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        log.info("비밀번호 검증 성공 - 사용자명: {}", user.getUsername());
        return UserResponseDTO.from(user);
    }
    
    private void validateDuplicateUser(SignupDTO signupDto) {
        if (userRepository.existsByUsername(signupDto.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userRepository.existsByEmail(signupDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        if (userRepository.existsByNickname(signupDto.getNickname())){
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }
    }
    
    public UserResponseDTO getUserInfo(String username) {
    	User user = userRepository.findByUsername(username)
    			.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));    	
    	
    	return UserResponseDTO.from(user);
    }
    
    public void changePassword(String username, PasswordChangeDTO passwordDTO) {
    	User user = userRepository.findByUsername(username)
    			.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    	
    	//현재 비밀번호 확인
    	if(!bCryptEncoder.matches(passwordDTO.getPostPassword(), user.getPassword())) {
    		throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
    	}
    	
    	//새 비밀번호 암호화 및 저장
    	user.setPassword(bCryptEncoder.encode(passwordDTO.getNewPassword()));
    	userRepository.save(user);
    }
    
    @Transactional
    public void updateStyle(String username, StyleDTO styleDto) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        user.setStyle(styleDto.getStyle());
        userRepository.save(user);

        Account account = accountRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("계좌를 찾을 수 없습니다."));
        account.setRiskLevel(accountService.convertStyleToRiskLevel(styleDto.getStyle()));
        accountRepository.save(account);
    }
    
    public void updateNickname(String username, String newNickname) {
    	User user = userRepository.findByUsername(username)
    			.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    	
    	user.setNickname(newNickname);
    	userRepository.save(user);
    }
}