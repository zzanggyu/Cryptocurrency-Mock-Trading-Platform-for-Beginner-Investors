package com.crypto.trading.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.FavoriteDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.service.FavoriteService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class FavoriteController {
   private final FavoriteService favoriteService;  // 즐겨찾기 관련 서비스
   
   @GetMapping
   public ResponseEntity<?> getFavorites(HttpSession session) {
       try {
           UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
           if (user == null) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
           }
           
           List<FavoriteDTO> favorites = favoriteService.getFavorites(user.getUsername());
           return ResponseEntity.ok(favorites);
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

   @PostMapping("/{symbol}")
   public ResponseEntity<?> toggleFavorite(
           @PathVariable("symbol") String symbol,
           @RequestParam("coinName") String coinName,
           HttpSession session) {
       try {
           UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
           if (user == null) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
           }

           boolean isNowFavorited = favoriteService.toggleFavorite(user.getUsername(), symbol, coinName);
           return ResponseEntity.ok(Map.of("favorited", isNowFavorited));
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
   
}
