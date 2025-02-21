package com.crypto.trading.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.dto.NewsDTO;
import com.crypto.trading.entity.News;
import com.crypto.trading.entity.User;
import com.crypto.trading.repository.NewsRepository;
import com.crypto.trading.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NewsService {
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    private NewsDTO convertToNewsDTO(News news, String username) {
        NewsDTO dto = NewsDTO.from(news);
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            dto.setFavorited(user != null && news.getFavoriteUsers().contains(user));
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<NewsDTO> getAllNews(Pageable pageable, String username) {
        return newsRepository.findAllByOrderByPublishDateDesc(pageable)
            .map(news -> convertToNewsDTO(news, username));
    }

    public News getLatestNews() {
        return newsRepository.findTopByOrderByPublishDateDesc();
    }

    public boolean existsByUrl(String url) {
        return newsRepository.existsByUrl(url);
    }

    public News saveNews(News news) {
        return newsRepository.save(news);
    }

    @Transactional(readOnly = true)
    public Page<NewsDTO> findByCategory(String category, Pageable pageable, String username) {
        return newsRepository.findByCategoriesContaining(category, pageable)
                .map(news -> convertToNewsDTO(news, username));
    }

    @Transactional(readOnly = true)
    public Page<NewsDTO> searchByKeyword(String keyword, Pageable pageable, String username) {
        return newsRepository.findByKeyword(keyword, pageable)
                .map(news -> convertToNewsDTO(news, username));
    }

    @Transactional(readOnly = true)
    public Page<NewsDTO> searchByKeywordInCategory(String category, String keyword, Pageable pageable, String username) {
        log.debug("Category and keyword search - category: {}, keyword: {}", category, keyword);
        return newsRepository.findByCategoryAndKeyword(category, keyword, pageable)
                .map(news -> convertToNewsDTO(news, username));
    }

    @Transactional
    public boolean toggleFavorite(Long newsId, String username) {
        if (username == null) {
            throw new RuntimeException("로그인이 필요한 서비스입니다.");
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        News news = newsRepository.findById(newsId)
            .orElseThrow(() -> new RuntimeException("뉴스를 찾을 수 없습니다."));

        boolean isFavorite;
        if (user.getFavoriteNews().contains(news)) {
            user.removeFavoriteNews(news);
            isFavorite = false;
        } else {
            user.addFavoriteNews(news);
            isFavorite = true;
        }
        
        userRepository.save(user);  // 변경사항 저장
        
        log.info("관심 뉴스 토글 - 사용자: {}, 뉴스: {}, 상태: {}", 
            username, newsId, isFavorite ? "추가" : "제거");
        
        return isFavorite;
    }

    @Transactional(readOnly = true)
    public Page<NewsDTO> getFavoriteNews(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return newsRepository.findByFavoriteUsers(user, pageable)
                .map(news -> {
                    NewsDTO dto = convertToNewsDTO(news, username);
                    dto.setFavorited(true);  // 관심 뉴스 목록이므로 항상 true
                    return dto;
                });
    }

    @Transactional(readOnly = true)
    public Page<NewsDTO> searchFavoriteNewsByKeyword(String username, String keyword, Pageable pageable) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return newsRepository.findByFavoriteUsersAndKeyword(user, keyword, pageable)
                .map(news -> {
                    NewsDTO dto = convertToNewsDTO(news, username);
                    dto.setFavorited(true);  // 관심 뉴스 목록이므로 항상 true
                    return dto;
                });
    }
}