package com.crypto.trading.dto;

import com.crypto.trading.entity.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
    private Long userId;
    private String username;
    private String nickname;
    private String email;
    private String style;

    public static UserResponseDTO from(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setStyle(user.getStyle());
        dto.setNickname(user.getNickname());
        return dto;
    }
}