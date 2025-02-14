package com.crypto.trading.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.trading.entity.FavoritedId;
import com.crypto.trading.entity.User;
import com.crypto.trading.entity.UserFavorite;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, FavoritedId> {
	List<UserFavorite> findByUser(User user);
	void deleteByUserAndSymbol(User user, String symbol);
	boolean existsByUserAndSymbol(User user, String symbol);
}
