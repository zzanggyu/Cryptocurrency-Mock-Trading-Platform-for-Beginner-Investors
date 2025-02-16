package com.crypto.trading.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_favorite_news",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "news_id")
    )
    @JsonManagedReference
    private Set<News> favoriteNews = new HashSet<>();

    public void addFavoriteNews(News news) {
        this.favoriteNews.add(news);
        news.getFavoriteUsers().add(this);
    }

    public void removeFavoriteNews(News news) {
        this.favoriteNews.remove(news);
        news.getFavoriteUsers().remove(this);
    }
}