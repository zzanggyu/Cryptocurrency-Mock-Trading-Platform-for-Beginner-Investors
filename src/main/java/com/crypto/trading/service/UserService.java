package com.crypto.trading.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.config.BCryptEncoder;
import com.crypto.trading.dto.LoginRequestDTO;
import com.crypto.trading.dto.PasswordChangeDTO;
import com.crypto.trading.dto.SignupDTO;
import com.crypto.trading.dto.StyleDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.entity.User;
import com.crypto.trading.entity.VirtualAccount;
import com.crypto.trading.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptEncoder bCryptEncoder;

    public UserResponseDTO signup(SignupDTO signupDto) {
        if (userRepository.existsByUsername(signupDto.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userRepository.existsByEmail(signupDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        if (userRepository.existsByNickname(signupDto.getNickname())){
        	throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }

        User user = new User();
        user.setUsername(signupDto.getUsername());
        user.setNickname(signupDto.getNickname());
        user.setEmail(signupDto.getEmail());
        user.setPassword(bCryptEncoder.encode(signupDto.getPassword()));

        VirtualAccount virtualAccount = new VirtualAccount(user);
        user.setVirtualAccount(virtualAccount);

        User savedUser = userRepository.save(user);
        return UserResponseDTO.from(savedUser);
    }

    public UserResponseDTO login(LoginRequestDTO loginDto) {
        User user = userRepository.findByUsername(loginDto.getUsername())
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!bCryptEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return UserResponseDTO.from(user);
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
    public void updateStyle(String username, StyleDTO styleDto) {
    	User user = userRepository.findByUsername(username)
    			.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    	
    	user.setStyle(styleDto.getStyle());
    	userRepository.save(user);
    }
    public void updateNickname(String username, String newNickname) {
    	User user = userRepository.findByUsername(username)
    			.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    	
    	user.setNickname(newNickname);
    	userRepository.save(user);
    }
}