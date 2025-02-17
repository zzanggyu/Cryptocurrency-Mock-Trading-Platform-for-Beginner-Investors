package com.crypto.trading.config;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class BCryptEncoder {
    public String encode(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }
    
    public boolean matches(String password, String hashedPassword) {
        return BCrypt.checkpw(password, hashedPassword);
    }
}