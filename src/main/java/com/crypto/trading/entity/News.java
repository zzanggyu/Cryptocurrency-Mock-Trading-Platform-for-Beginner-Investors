package com.crypto.trading.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
* 뉴스 정보를 담는 엔티티 클래스
* JPA를 사용하여 데이터베이스의 'news' 테이블과 매핑됨
*/
@Entity
@Table(name = "cryptonews")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
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
   
   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
   private LocalDateTime publishDate;
   
   private String source;
   
   private String author;  // 기자 이름
   
   @ElementCollection(fetch = FetchType.LAZY)
   @CollectionTable(
       name = "cryptonews_categories", 
       joinColumns = @JoinColumn(name = "news_id")
   )
   @Column(name = "category")
   private Set<String> categories = new HashSet<>();
   
   @ElementCollection(fetch = FetchType.EAGER)
   @CollectionTable(
       name = "cryptonews_keywords", 
       joinColumns = @JoinColumn(name = "news_id")
   )
   @Column(name = "keyword")
   private Set<String> keywords = new HashSet<>();

   // 키워드 추가를 위한 헬퍼 메소드
   public void addKeyword(String keyword) {
       if (this.keywords == null) {
           this.keywords = new HashSet<>();
       }
       this.keywords.add(keyword);
   }

   // 카테고리 추가를 위한 헬퍼 메소드
   public void addCategory(String category) {
       if (this.categories == null) {
           this.categories = new HashSet<>();
       }
       this.categories.add(category);
   }

   // 여러 카테고리를 한번에 설정하는 메소드
   public void setCategories(Set<String> categories) {
       this.categories = categories;
   }

   @ManyToMany(mappedBy = "favoriteNews", fetch = FetchType.LAZY)
   @JsonIgnore
   private Set<User> favoriteUsers = new HashSet<>();
   
   // getter와 setter 추가
   public Set<User> getFavoriteUsers() {
       return favoriteUsers;
   }
   
   public void setFavoriteUsers(Set<User> favoriteUsers) {
       this.favoriteUsers = favoriteUsers;
   }

   @PrePersist
   @PreUpdate
   public void prePersist() {
       if (this.categories == null) {
           this.categories = new HashSet<>();
       }
       if (this.keywords == null) {
           this.keywords = new HashSet<>();
       }
       if (this.favoriteUsers == null) {
           this.favoriteUsers = new HashSet<>();
       }
   }

   // toString 메서드 추가
   @Override
   public String toString() {
       return "News{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", url='" + url + '\'' +
               ", publishDate=" + publishDate +
               ", source='" + source + '\'' +
               ", author='" + author + '\'' +
               ", categories=" + categories +
               ", keywords=" + keywords +
               '}';
   }
}