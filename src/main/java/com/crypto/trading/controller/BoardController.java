package com.crypto.trading.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.BoardDTO;
import com.crypto.trading.dto.CommentDTO;
import com.crypto.trading.service.BoardService;
import com.crypto.trading.service.CommentService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/boards")

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BoardController {
	private final BoardService boardService;
	private final CommentService commentService;
	
	@GetMapping
	public ResponseEntity<?> getAllBoards(HttpSession session){
		try {
			return ResponseEntity.ok(boardService.getAllBoards(session));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getBoard(@PathVariable("id") Long id, HttpSession session) {
		try {
			return ResponseEntity.ok(boardService.getBoard(id, session));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping
	public ResponseEntity<?> createBoard(@RequestBody BoardDTO board, HttpSession session) {
		try {
			return ResponseEntity.ok(boardService.createBoard(board, session));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateBoard(@PathVariable("id") Long id,@RequestBody BoardDTO board, HttpSession session) {
		try {
			return ResponseEntity.ok(boardService.updateBoard(id, board, session));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/{id}/like")
	public ResponseEntity<?> likeBoard(@PathVariable("id") Long id, HttpSession session){
		try {
			boardService.likeBoard(id,session);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteBoard(@PathVariable("id") Long id, HttpSession session){
		try {
			boardService.deleteBoard(id, session);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/{boardId}/comments")
	   public ResponseEntity<?> createComment(@PathVariable("boardId") Long boardId, @RequestBody CommentDTO commentDto, HttpSession session) {
	       try {
	           return ResponseEntity.ok(commentService.createComment(boardId, commentDto, session));
	       } catch (RuntimeException e) {
	           return ResponseEntity.badRequest().body(e.getMessage());
	       }
	   }

   @PutMapping("/comments/{id}")
   public ResponseEntity<?> updateComment(@PathVariable("id") Long id, @RequestBody CommentDTO commentDto, HttpSession session) {
       try {
           return ResponseEntity.ok(commentService.updateComment(id, commentDto, session));
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

   @DeleteMapping("/comments/{id}") 
   public ResponseEntity<?> deleteComment(@PathVariable("id") Long id, HttpSession session) {
       try {
           commentService.deleteComment(id, session);
           return ResponseEntity.ok().build();
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
}
