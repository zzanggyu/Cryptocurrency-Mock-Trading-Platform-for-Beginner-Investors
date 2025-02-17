package com.crypto.trading.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.crypto.trading.entity.News;
import com.crypto.trading.entity.User;

import java.time.LocalDateTime;
import java.util.List;

/**
* 뉴스 데이터에 접근하기 위한 리포지토리 인터페이스
* JpaRepository를 상속받아 기본적인 CRUD 기능을 제공받음
*/
@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
   
   // 카테고리 내 검색을 위한 메서드 추가 
	@Query("SELECT n FROM News n WHERE EXISTS (SELECT 1 FROM n.categories c WHERE c = :category) " +
		       "AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
		       "OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
		Page<News> findByCategoryAndKeyword(
		    @Param("category") String category, 
		    @Param("keyword") String keyword, 
		    Pageable pageable
		);
	

   // 전체 검색을 위한 메서드 추가
   @Query("SELECT n FROM News n WHERE n.title LIKE %:keyword% OR n.content LIKE %:keyword%")
   Page<News> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

   /**
   * 제목에 특정 키워드가 포함된 뉴스 검색
   * @param keyword 검색할 키워드
   * @return 검색된 뉴스 목록
   */
   List<News> findByTitleContaining(String keyword);

   /**
   * 특정 기간 내의 뉴스 검색
   * @param start 검색 시작 날짜
   * @param end 검색 종료 날짜
   * @return 해당 기간 내의 뉴스 목록
   */
   List<News> findByPublishDateBetween(LocalDateTime start, LocalDateTime end);

   /**
   * 특정 키워드가 포함된 뉴스 검색
   * @param keyword 검색할 키워드
   * @return 키워드가 포함된 뉴스 목록
   */
   List<News> findByKeywordsContaining(String keyword);

   /**
   * 모든 뉴스를 발행일 기준 내림차순으로 조회
   * @return 정렬된 뉴스 목록
   */
   List<News> findAllByOrderByPublishDateDesc();

   List<News> findByCategoriesContaining(String category);

   News findTopByOrderByPublishDateDesc();

   // 페이지네이션 지원 메서드
   Page<News> findAllByOrderByPublishDateDesc(Pageable pageable);

   // 검색 기능 (페이지네이션)
   Page<News> findByTitleContaining(String keyword, Pageable pageable);
   Page<News> findByCategoriesContaining(String category, Pageable pageable);


   /**
   * URL로 뉴스 존재 여부 확인 (중복 체크용)
   * @param url 확인할 뉴스 URL
   * @return 존재 여부 (true/false)
   */
   boolean existsByUrl(String url);
}