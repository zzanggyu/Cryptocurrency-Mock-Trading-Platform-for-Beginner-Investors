package com.crypto.trading.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
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
    private Long userId;

    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String nickname;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    private String style;

    // Account 관계
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Account account;

    // 뉴스 즐겨찾기 관계
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_favorite_news",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "news_id")
    )
    private Set<News> favoriteNews = new HashSet<>();

    // 게시판 관련 관계
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();


    // 즐겨찾기 코인 관계
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<UserFavorite> favorites = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }

    // 뉴스 즐겨찾기 관련 메서드
    public void addFavoriteNews(News news) {
        this.favoriteNews.add(news);
        news.getFavoriteUsers().add(this);
    }

    public void removeFavoriteNews(News news) {
        this.favoriteNews.remove(news);
        news.getFavoriteUsers().remove(this);
    }
}