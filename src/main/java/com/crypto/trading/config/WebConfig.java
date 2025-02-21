package com.crypto.trading.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//WebConfig.java - 웹 관련 설정 (CORS 등)
@Configuration  // 스프링 설정 클래스
public class WebConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry registry) {
	    registry.addMapping("/**")                      // 모든 경로에 대해
	            .allowedOrigins("http://localhost:3000")  // React 개발 서버 허용
	            .allowedMethods("*")                      // 모든 HTTP 메서드 허용
	            .allowedHeaders("*")                      // 모든 헤더 허용
	            .allowCredentials(true)                   // 인증 정보(쿠키) 허용
	            .maxAge(3600);                           // preflight 요청 캐시 시간(초)
	}
}