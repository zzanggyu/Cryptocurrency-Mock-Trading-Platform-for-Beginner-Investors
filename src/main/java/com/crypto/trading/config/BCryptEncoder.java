package com.crypto.trading.config;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Component;

//BCryptEncoder.java - 비밀번호 암호화를 위한 컴포넌트
@Component
public class BCryptEncoder {
// 비밀번호를 BCrypt 알고리즘으로 암호화
	public String encode(String password) {
	    return BCrypt.hashpw(password, BCrypt.gensalt());  // 솔트를 생성하고 해시화
	}
	
	// 평문 비밀번호와 암호화된 비밀번호 일치 여부 확인
	public boolean matches(String password, String hashedPassword) {
	    return BCrypt.checkpw(password, hashedPassword);  // 해시값 비교
	}
}