package com.crypto.trading.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.crypto.trading.entity.News;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsDTO {
    private Long id;
    private String title;
    private String content;
    private String url;
    private String imageUrl;
    private LocalDateTime publishDate;
    private String source;
    private String author;
    private Set<String> categories = new HashSet<>();
    private Set<String> keywords = new HashSet<>();
    private boolean isFavorited;

    public static NewsDTO from(News news) {
        return NewsDTO.builder()
                .id(news.getId())
                .title(news.getTitle())
                .content(news.getContent())
                .url(news.getUrl())
                .imageUrl(news.getImageUrl())
                .publishDate(news.getPublishDate())
                .source(news.getSource())
                .author(news.getAuthor())
                .categories(news.getCategories() != null ? news.getCategories() : new HashSet<>())
                .keywords(news.getKeywords() != null ? news.getKeywords() : new HashSet<>())
                .isFavorited(false)  // 기본값은 false로 설정
                .build();
    }

    public News toEntity() {
        News news = new News();
        news.setTitle(this.title);
        news.setContent(this.content);
        news.setUrl(this.url);
        news.setImageUrl(this.imageUrl);
        news.setPublishDate(this.publishDate);
        news.setSource(this.source);
        news.setAuthor(this.author);
        news.setCategories(this.categories);
        news.setKeywords(this.keywords);
        news.setFavoriteUsers(new HashSet<>());  // 즐겨찾기 사용자 초기화
        return news;
    }
}