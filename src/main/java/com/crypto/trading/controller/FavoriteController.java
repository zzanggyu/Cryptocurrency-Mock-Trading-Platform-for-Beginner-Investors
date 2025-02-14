package com.crypto.trading.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.service.FavoriteService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FavoriteController {
	private final FavoriteService favoriteService;
	
	@GetMapping
	public ResponseEntity<?> getFavorites(HttpSession session){
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		if(user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
		}
		
		try {
			return ResponseEntity.ok(favoriteService.getFavorites(user.getUsername()));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping
	public ResponseEntity<?> addFavorite(@RequestBody Map<String, String> request, HttpSession session) {
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		if(user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
		}
		
		try {
			favoriteService.addFavorite(user.getUsername(), request.get("symbol"), request.get("coinname"));
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/{symbol}")
	public ResponseEntity<?> deleteFavorite(@PathVariable("symbol") String symbol, HttpSession session){
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		if(user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
		}
		
		try {
			favoriteService.deleteFavorite(user.getUsername(), symbol);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
}
