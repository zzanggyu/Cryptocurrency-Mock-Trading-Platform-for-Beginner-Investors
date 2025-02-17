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
	private final UserFavoriteRepository favoriteRepository;
	private final UserRepository userRepository;
	
	public List<FavoriteDTO> getFavorites(String username){
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
		
		return favoriteRepository.findByUser(user).stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public void addFavorite(String username, String symbol, String coinName) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
		
		if(favoriteRepository.existsByUserAndSymbol(user, symbol)) {
			throw new RuntimeException("이미 추가된 코인입니다.");
		}
		
		UserFavorite favorite = new UserFavorite();
		favorite.setUser(user);
		favorite.setSymbol(symbol);
		favorite.setCoinName(coinName);
		
		favoriteRepository.save(favorite);
	}
	
	public void deleteFavorite(String username, String symbol) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
		
		favoriteRepository.deleteByUserAndSymbol(user, symbol);
	}
	
	private FavoriteDTO convertToDto(UserFavorite favorite) {
		FavoriteDTO dto = new FavoriteDTO();
		dto.setSymbol(favorite.getSymbol());
		dto.setCoinName(favorite.getCoinName());
		
		return dto;
	}
}
