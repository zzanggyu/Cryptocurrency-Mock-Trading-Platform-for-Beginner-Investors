package com.crypto.trading.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


//사용자 정보 응답 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
 private Long id;
 private String username;
 private String email;
}