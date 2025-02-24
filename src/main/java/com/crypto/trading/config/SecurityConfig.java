package com.crypto.trading.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS 설정
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // CSRF 비활성화
            .csrf(csrf -> csrf.disable())
            // 세션 관리 설정
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            // 요청 권한 설정
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/api/signup", 
                    "/api/login", 
                    "api/logout",
                    "/api/market/ticker",
                    "/api/news/**",
                    "/api/all-data/**",
                    "/api/assets/**",
                    "/api/markets/**",
                    "/api/coins/**",        // 코인 정보 접근 허용
                    "/api/upbit/**",
                    "/api/user/info",
                    "/api/check-session",
                    "/api/transactions/**",
                    "/api/boards/**",
                    "/api/boards",
                    "/api/market/news",
                    "/api/news/crawled",
                    "/api/limit-orders",
                    "/api/limit-orders/account/**",
                    "/api/accounts/reset",
                    "/api/user/style",
                    "api/limit-orders/**",
                    "/api/accounts/**",// Upbit API 접근 허용
                    "/api/favorites/**"
                ).permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            // 폼 로그인 비활성화
            .formLogin(formLogin -> formLogin.disable())
            // HTTP Basic 인증 비활성화
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}