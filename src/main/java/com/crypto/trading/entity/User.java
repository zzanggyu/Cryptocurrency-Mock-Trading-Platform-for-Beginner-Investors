package com.crypto.trading.entity;

import java.time.LocalDateTime;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;                 // 사용자 고유 ID

    @Column(unique = true, nullable = false)
    private String username;             // 사용자 아이디(로그인용)
    
    @Column(unique = true, nullable = false)
    private String nickname;             // 사용자 닉네임(표시용)

    @Column(unique = true, nullable = false)
    private String email;                // 이메일

    @Column(nullable = false)
    private String password;             // BCrypt로 암호화된 비밀번호

    @Column(name = "create_at")
    private LocalDateTime createAt;      // 계정 생성일시

    private String style;                // 투자 성향

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)  // 일대일 관계: 사용자당 하나의 가상계좌
    private VirtualAccount virtualAccount;  // 가상계좌 정보

    @PrePersist
    public void prePersist() {          // 계정 생성 시 현재 시간 자동 설정
        this.createAt = LocalDateTime.now();
    }
}