package com.crypto.trading.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.entity.FavoritedId;
import com.crypto.trading.entity.User;
import com.crypto.trading.entity.UserFavorite;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, FavoritedId> {
   // 특정 사용자의 즐겨찾기 목록 조회
   List<UserFavorite> findByUser(User user);
   
   // 특정 사용자의 특정 코인 즐겨찾기 삭제
   void deleteByUserAndSymbol(User user, String symbol);
   
   // 특정 사용자가 특정 코인을 즐겨찾기했는지 확인
   boolean existsByUserAndSymbol(User user, String symbol);
}