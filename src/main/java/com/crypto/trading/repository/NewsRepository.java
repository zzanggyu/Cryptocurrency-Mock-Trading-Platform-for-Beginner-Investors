package com.crypto.trading.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.crypto.trading.entity.News;
import com.crypto.trading.entity.User;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    
    // 기본 뉴스 조회 (페이징)  
    @Query("SELECT n FROM News n ORDER BY n.publishDate DESC")
    Page<News> findAllByOrderByPublishDateDesc(Pageable pageable);

    // 카테고리별 뉴스 검색 (페이징)
    @Query("SELECT n FROM News n WHERE :category MEMBER OF n.categories ORDER BY n.publishDate DESC")
    Page<News> findByCategoriesContaining(@Param("category") String category, Pageable pageable);

    // 키워드 검색 (페이징)
    @Query("SELECT n FROM News n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY n.publishDate DESC")
    Page<News> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 카테고리 내 키워드 검색 (페이징)
    @Query("SELECT n FROM News n WHERE EXISTS (SELECT 1 FROM n.categories c WHERE c = :category) " +
           "AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) ORDER BY n.publishDate DESC")
    Page<News> findByCategoryAndKeyword(
        @Param("category") String category, 
        @Param("keyword") String keyword, 
        Pageable pageable
    );

    // 사용자 관심 뉴스 조회 (페이징)
    @Query("SELECT n FROM News n JOIN n.favoriteUsers u WHERE u = :user ORDER BY n.publishDate DESC")
    Page<News> findByFavoriteUsers(@Param("user") User user, Pageable pageable);

    // 관심 뉴스 내 키워드 검색 (페이징)
    @Query("SELECT n FROM News n JOIN n.favoriteUsers u " +
           "WHERE u = :user " +
           "AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) ORDER BY n.publishDate DESC")
    Page<News> findByFavoriteUsersAndKeyword(
        @Param("user") User user,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    // 기간별 뉴스 검색
    List<News> findByPublishDateBetween(LocalDateTime start, LocalDateTime end);

    // 제목 키워드 검색
    List<News> findByTitleContaining(String keyword);

    // 키워드 포함 검색
    List<News> findByKeywordsContaining(String keyword);

    // 최신 뉴스 1건 조회
    News findTopByOrderByPublishDateDesc();

    // URL 중복 체크
    boolean existsByUrl(String url);
}