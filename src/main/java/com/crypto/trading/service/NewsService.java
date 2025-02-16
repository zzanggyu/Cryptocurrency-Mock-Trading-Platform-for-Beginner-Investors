package com.crypto.trading.service;

import com.crypto.trading.config.JwtUtil;
import com.crypto.trading.domain.News;
import com.crypto.trading.domain.User;
import com.crypto.trading.repository.NewsRepository;
import com.crypto.trading.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public News getLatestNews() {
        return newsRepository.findTopByOrderByPublishDateDesc();
    }

    @Transactional(readOnly = true)
    public boolean existsByUrl(String url) {
        return newsRepository.existsByUrl(url);
    }

    @Transactional(readOnly = true)
    public Page<News> getAllNews(Pageable pageable) {
        return newsRepository.findAllByOrderByPublishDateDesc(pageable);
    }

    @Transactional(readOnly = true)
    public Page<News> findByCategory(String category, Pageable pageable) {
        try {
            log.info("카테고리로 뉴스 검색: {}", category);
            return newsRepository.findByCategoriesContaining(category, pageable);
        } catch (Exception e) {
            log.error("카테고리 검색 중 에러 발생: ", e);
            throw new RuntimeException("카테고리 검색 실패: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<News> searchByKeyword(String keyword, Pageable pageable) {
        return newsRepository.findByTitleContaining(keyword, pageable);
    }

    @Transactional
    public News saveNews(News news) {
        if(!newsRepository.existsByUrl(news.getUrl())) {
            return newsRepository.save(news);
        }
        return null;
    }

    @Transactional
    public boolean toggleFavorite(Long newsId, String username) {
        try {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("뉴스를 찾을 수 없습니다."));

            boolean isFavorite;
            if (user.getFavoriteNews().contains(news)) {
                user.getFavoriteNews().remove(news);
                isFavorite = false;
            } else {
                user.getFavoriteNews().add(news);
                isFavorite = true;
            }
            
            userRepository.save(user);  // 변경사항 저장
            log.info("관심 뉴스 토글 성공 - 사용자: {}, 뉴스: {}, 상태: {}", 
                username, newsId, isFavorite ? "추가" : "제거");
            return isFavorite;
            
        } catch (Exception e) {
            log.error("관심 뉴스 토글 실패 - 사용자: {}, 뉴스: {}, 에러: {}", 
                username, newsId, e.getMessage());
            throw new RuntimeException("관심 뉴스 설정에 실패했습니다: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<News> getFavoriteNews(String username, Pageable pageable) {
        try {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            return newsRepository.findByFavoriteUsers(user, pageable);
        } catch (Exception e) {
            log.error("관심 뉴스 조회 실패 - 사용자: {}, 에러: {}", username, e.getMessage());
            throw new RuntimeException("관심 뉴스 조회에 실패했습니다: " + e.getMessage());
        }
    }
    // 카테고리 내 검색 메서드
    @Transactional(readOnly = true)
    public Page<News> searchByKeywordInCategory(String category, String keyword, Pageable pageable) {
        log.debug("Category and keyword search - category: {}, keyword: {}", category, keyword);
        return newsRepository.findByCategoryAndKeyword(category, keyword, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<News> searchFavoriteNewsByKeyword(String username, String keyword, Pageable pageable) {
        try {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            return newsRepository.findByFavoriteUsersAndKeyword(user, keyword, pageable);
        } catch (Exception e) {
            log.error("관심 뉴스 검색 실패 - 사용자: {}, 키워드: {}, 에러: {}", 
                username, keyword, e.getMessage());
            throw new RuntimeException("관심 뉴스 검색에 실패했습니다: " + e.getMessage());
        }
    }
    }
    
    
  
    