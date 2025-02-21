package com.crypto.trading.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.crypto.trading.dto.FavoriteDTO;
import com.crypto.trading.entity.User;
import com.crypto.trading.entity.UserFavorite;
import com.crypto.trading.repository.UserFavoriteRepository;
import com.crypto.trading.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {
   private final UserFavoriteRepository favoriteRepository;  // 즐겨찾기 정보 저장소
   private final UserRepository userRepository;             // 사용자 정보 저장소
   
   // 사용자의 즐겨찾기 목록 조회
   public List<FavoriteDTO> getFavorites(String username){
       // username으로 사용자 조회, 없으면 예외 발생
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
       
       // 해당 사용자의 모든 즐겨찾기를 DTO로 변환하여 목록 반환
       return favoriteRepository.findByUser(user).stream()
               .map(this::convertToDto)
               .collect(Collectors.toList());
   }
   
   // 새로운 코인 즐겨찾기 추가
   public void addFavorite(String username, String symbol, String coinName) {
       // username으로 사용자 조회
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
       
       // 이미 즐겨찾기한 코인인지 확인
       if(favoriteRepository.existsByUserAndSymbol(user, symbol)) {
           throw new RuntimeException("이미 추가된 코인입니다.");
       }
       
       // 새 즐겨찾기 엔티티 생성 및 저장
       UserFavorite favorite = new UserFavorite();
       favorite.setUser(user);
       favorite.setSymbol(symbol);      // 코인 심볼(예: BTC)
       favorite.setCoinName(coinName);  // 코인 이름(예: Bitcoin)
       
       favoriteRepository.save(favorite);
   }
   
   // 즐겨찾기 삭제
   public void deleteFavorite(String username, String symbol) {
       // username으로 사용자 조회
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
       
       // 해당 사용자의 특정 코인 즐겨찾기 삭제
       favoriteRepository.deleteByUserAndSymbol(user, symbol);
   }
   
   // 즐겨찾기 엔티티를 DTO로 변환
   private FavoriteDTO convertToDto(UserFavorite favorite) {
       FavoriteDTO dto = new FavoriteDTO();
       dto.setSymbol(favorite.getSymbol());      // 코인 심볼
       dto.setCoinName(favorite.getCoinName());  // 코인 이름
       
       return dto;
   }
}