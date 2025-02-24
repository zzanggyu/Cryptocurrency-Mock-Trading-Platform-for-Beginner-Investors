package com.crypto.trading.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
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
    
    // 뉴스 관련 기능 추가
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_favorite_news",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "news_id")
    )
    private Set<News> favoriteNews = new HashSet<>();
    
    @PrePersist
    public void prePersist() {          // 계정 생성 시 현재 시간 자동 설정
        this.createAt = LocalDateTime.now();
    }
    
    // 뉴스 즐겨찾기 추가 메서드
    public void addFavoriteNews(News news) {
        this.favoriteNews.add(news);
        news.getFavoriteUsers().add(this);
    }
    
    // 뉴스 즐겨찾기 제거 메서드 
    public void removeFavoriteNews(News news) {
        this.favoriteNews.remove(news);
        news.getFavoriteUsers().remove(this);
    }
    
    // getter와 setter 추가
    public Set<News> getFavoriteNews() {
        return favoriteNews;
    }
    
    public void setFavoriteNews(Set<News> favoriteNews) {
        this.favoriteNews = favoriteNews;
    }
}