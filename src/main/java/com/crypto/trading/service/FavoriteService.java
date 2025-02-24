package com.crypto.trading.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.crypto.trading.dto.FavoriteDTO;
import com.crypto.trading.entity.User;
import com.crypto.trading.entity.UserFavorite;
import com.crypto.trading.repository.UserFavoriteRepository;
import com.crypto.trading.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {
   private final UserFavoriteRepository favoriteRepository;  // 즐겨찾기 정보 저장소
   private final UserRepository userRepository;             // 사용자 정보 저장소
   
   @Transactional(readOnly = true)
   public List<FavoriteDTO> getFavorites(String username) {
       User user = userRepository.findByUsername(username)
           .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
       return favoriteRepository.findByUser(user)
           .stream()
           .map(FavoriteDTO::from)
           .collect(Collectors.toList());
   }
   
   @Transactional
   public boolean toggleFavorite(String username, String symbol, String coinName) {
       User user = userRepository.findByUsername(username)
           .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

       boolean exists = favoriteRepository.existsByUserAndSymbol(user, symbol);
       if (exists) {
           // 이미 즐겨찾기된 경우 삭제
           favoriteRepository.deleteByUserAndSymbol(user, symbol);
           return false;
       } else {
           // 새로운 즐겨찾기 추가
           UserFavorite favorite = new UserFavorite();
           favorite.setUser(user);
           favorite.setSymbol(symbol);
           favorite.setCoinName(coinName);
           favoriteRepository.save(favorite);
           return true;
       }
   }
}