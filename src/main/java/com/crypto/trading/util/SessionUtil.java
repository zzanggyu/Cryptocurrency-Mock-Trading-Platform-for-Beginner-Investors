package com.crypto.trading.util;


import org.springframework.stereotype.Component;

import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.exception.UnauthorizedException;

import jakarta.servlet.http.HttpSession;

@Component
public class SessionUtil {
    private final String USER_SESSION_KEY = "LOGGED_IN_USER";

    public UserResponseDTO getLoggedInUser(HttpSession session) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute(USER_SESSION_KEY);
        if (user == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }
        return user;
    }

    public void setLoggedInUser(HttpSession session, UserResponseDTO user) {
        session.setAttribute(USER_SESSION_KEY, user);
    }

    public void clearSession(HttpSession session) {
        session.removeAttribute(USER_SESSION_KEY);
        session.invalidate();
    }

    public boolean isLoggedIn(HttpSession session) {
        return session.getAttribute(USER_SESSION_KEY) != null;
    }
}