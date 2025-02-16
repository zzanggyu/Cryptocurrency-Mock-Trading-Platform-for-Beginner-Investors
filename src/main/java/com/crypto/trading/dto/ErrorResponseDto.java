package com.crypto.trading.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


//에러 응답 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDto {
 private String message;
}