package com.crypto.trading.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cryptonews")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String url;
    
    @Column(length = 1000)
    private String imageUrl;
    
    private LocalDateTime publishDate;
    
    private String source;
    
    private String author;
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "cryptonews_categories", joinColumns = @JoinColumn(name = "news_id"))
    @Column(name = "category")
    private Set<String> categories = new HashSet<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "cryptonews_keywords", joinColumns = @JoinColumn(name = "news_id"))
    @Column(name = "keyword")
    private Set<String> keywords = new HashSet<>();
    
    @ManyToMany(mappedBy = "favoriteNews", fetch = FetchType.LAZY)
    private Set<User> favoriteUsers = new HashSet<>();
}