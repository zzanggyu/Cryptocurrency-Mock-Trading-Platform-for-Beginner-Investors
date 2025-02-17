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
   private final UserRepository userRepository;     // 사용자 정보 데이터베이스 접근용 리포지토리
   private final BCryptEncoder bCryptEncoder;       // 비밀번호 암호화/검증용 인코더

   // 회원가입 처리
   public UserResponseDTO signup(SignupDTO signupDto) {
       // 동일한 username이 있는지 확인
       if (userRepository.existsByUsername(signupDto.getUsername())) {
           throw new RuntimeException("이미 존재하는 사용자명입니다.");
       }
       // 동일한 email이 있는지 확인 
       if (userRepository.existsByEmail(signupDto.getEmail())) {
           throw new RuntimeException("이미 존재하는 이메일입니다.");
       }
       // 동일한 nickname이 있는지 확인
       if (userRepository.existsByNickname(signupDto.getNickname())){
           throw new RuntimeException("이미 존재하는 닉네임입니다.");
       }

       // 신규 사용자 엔티티 생성
       User user = new User();
       user.setUsername(signupDto.getUsername());
       user.setNickname(signupDto.getNickname()); 
       user.setEmail(signupDto.getEmail());
       // 비밀번호 암호화 저장
       user.setPassword(bCryptEncoder.encode(signupDto.getPassword()));

       // 가상계좌 생성 및 연결
       VirtualAccount virtualAccount = new VirtualAccount(user);
       user.setVirtualAccount(virtualAccount);

       // DB에 저장하고 DTO로 변환하여 반환
       User savedUser = userRepository.save(user);
       return UserResponseDTO.from(savedUser);
   }

   // 로그인 처리 
   public UserResponseDTO login(LoginRequestDTO loginDto) {
       // username으로 사용자 조회
       User user = userRepository.findByUsername(loginDto.getUsername())
           .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

       // 비밀번호 일치 여부 확인
       if (!bCryptEncoder.matches(loginDto.getPassword(), user.getPassword())) {
           throw new RuntimeException("비밀번호가 일치하지 않습니다.");
       }

       return UserResponseDTO.from(user);
   }
   
   // 사용자 정보 조회
   public UserResponseDTO getUserInfo(String username) {
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));    	
       
       return UserResponseDTO.from(user);
   }
   
   // 비밀번호 변경
   public void changePassword(String username, PasswordChangeDTO passwordDTO) {
       // 사용자 조회
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
       
       // 현재 비밀번호가 일치하는지 확인
       if(!bCryptEncoder.matches(passwordDTO.getPostPassword(), user.getPassword())) {
           throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
       }
       
       // 새 비밀번호 암호화하여 저장
       user.setPassword(bCryptEncoder.encode(passwordDTO.getNewPassword()));
       userRepository.save(user);
   }

   // 투자 스타일 업데이트
   public void updateStyle(String username, StyleDTO styleDto) {
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
       
       user.setStyle(styleDto.getStyle());
       userRepository.save(user);
   }

   // 닉네임 업데이트
   public void updateNickname(String username, String newNickname) {
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
       
       user.setNickname(newNickname);
       userRepository.save(user);
   }
}