package com.crypto.trading.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.crypto.trading.dto.NewsDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.entity.News;
import com.crypto.trading.service.NewsService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") 
public class NewsController {
   private final NewsService newsService;

   @GetMapping
   public ResponseEntity<Page<NewsDTO>> getAllNews(
           @PageableDefault(size = 10, sort = "publishDate", direction = Sort.Direction.DESC) 
           Pageable pageable,
           HttpSession session) {
       try {
           UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
           String username = user != null ? user.getUsername() : null;
           Page<NewsDTO> newsPage = newsService.getAllNews(pageable, username);
           return ResponseEntity.ok(newsPage);
       } catch (Exception e) {
           log.error("뉴스 목록 조회 중 에러 발생: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }

   @GetMapping("/latest")
   public ResponseEntity<Map<String, String>> getLatestNewsUrl() {
       News latestNews = newsService.getLatestNews();
       Map<String, String> response = new HashMap<>();
       if (latestNews != null) {
           response.put("url", latestNews.getUrl());
           return ResponseEntity.ok(response);
       }
       return ResponseEntity.ok(new HashMap<>());
   }

   @PostMapping(value = "/crawled", 
               consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8"}, 
               produces = MediaType.APPLICATION_JSON_VALUE)
   public ResponseEntity<?> receiveCrawledNews(@RequestBody News news) {
       try {
           log.info("수신된 뉴스 데이터: {}", news);
           
           if (news.getUrl() == null || news.getUrl().isEmpty()) {
               return ResponseEntity.badRequest().body("URL이 필요합니다.");
           }
           if (news.getTitle() == null || news.getTitle().isEmpty()) {
               return ResponseEntity.badRequest().body("제목이 필요합니다.");
           }

           if (newsService.existsByUrl(news.getUrl())) {
               log.info("중복된 URL 발견: {}", news.getUrl());
               return ResponseEntity.ok().body(Map.of("message", "이미 존재하는 뉴스입니다.", "url", news.getUrl()));
           }

           if (news.getCategories() == null) {
               news.setCategories(new HashSet<>());
           }
           if (news.getKeywords() == null) {
               news.setKeywords(new HashSet<>());
           }
           news.setFavoriteUsers(new HashSet<>());

           News savedNews = newsService.saveNews(news);
           log.info("새 기사 저장 성공 - ID: {}, 제목: {}", savedNews.getId(), savedNews.getTitle());
           
           Map<String, Object> response = new HashMap<>();
           response.put("id", savedNews.getId());
           response.put("title", savedNews.getTitle());
           response.put("url", savedNews.getUrl());
           response.put("message", "저장 성공");
           
           return ResponseEntity.ok(response);
       } catch (Exception e) {
           log.error("뉴스 저장 중 에러 발생: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                              .body(Map.of("error", e.getMessage()));
       }
   }

   @GetMapping("/check")
   public ResponseEntity<?> checkUrlExists(@RequestParam String url) {
       try {
           boolean exists = newsService.existsByUrl(url);
           return ResponseEntity.ok(Map.of("exists", exists));
       } catch (Exception e) {
           log.error("URL 확인 중 에러 발생: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                              .body(Map.of("error", e.getMessage()));
       }
   }

   @GetMapping("/search")
   public ResponseEntity<Page<NewsDTO>> searchNews(
           @RequestParam(value = "keyword", required = false) String keyword,
           @RequestParam(value = "category", required = false) String category,
           @PageableDefault(size = 10, sort = "publishDate", direction = Sort.Direction.DESC) 
           Pageable pageable,
           HttpSession session) {
       try {
           UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
           String username = user != null ? user.getUsername() : null;

           Page<NewsDTO> newsPage;
           if (category != null && !category.isEmpty()) {
               if (keyword != null && !keyword.isEmpty()) {
                   newsPage = newsService.searchByKeywordInCategory(category, keyword, pageable, username);
               } else {
                   newsPage = newsService.findByCategory(category, pageable, username);
               }
           } else if (keyword != null && !keyword.isEmpty()) {
               newsPage = newsService.searchByKeyword(keyword, pageable, username);
           } else {
               newsPage = newsService.getAllNews(pageable, username);
           }
           return ResponseEntity.ok(newsPage);
       } catch (Exception e) {
           log.error("검색 중 에러 발생: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }
   
   @PostMapping("/{newsId}/favorite")
   public ResponseEntity<?> toggleFavorite(
           @PathVariable("newsId") Long newsId,
           HttpSession session) {
       try {
           UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
           if (user == null) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(Map.of("error", "로그인이 필요합니다."));
           }
           
           boolean isFavorite = newsService.toggleFavorite(newsId, user.getUsername());
           return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
       } catch (Exception e) {
           log.error("관심 뉴스 토글 중 에러 발생: ", e);
           return ResponseEntity.badRequest()
                              .body(Map.of("error", e.getMessage()));
       }
   }

   @GetMapping("/favorites")
   public ResponseEntity<Page<NewsDTO>> getFavoriteNews(
       HttpSession session,
       Pageable pageable) {
       try {
           UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
           if (user == null) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
           }
           
           Page<NewsDTO> favorites = newsService.getFavoriteNews(user.getUsername(), pageable);
           return ResponseEntity.ok(favorites);
       } catch (Exception e) {
           log.error("관심 뉴스 조회 중 에러 발생: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }

   @GetMapping("/favorites/search")
   public ResponseEntity<Page<NewsDTO>> searchFavoriteNews(
       HttpSession session,
       @RequestParam(name = "keyword") String keyword,
       Pageable pageable) {
       try {
           UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
           if (user == null) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
           }
           
           Page<NewsDTO> favorites = newsService.searchFavoriteNewsByKeyword(
               user.getUsername(), keyword, pageable);
           return ResponseEntity.ok(favorites);
       } catch (Exception e) {
           log.error("관심 뉴스 검색 중 에러 발생: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }
}