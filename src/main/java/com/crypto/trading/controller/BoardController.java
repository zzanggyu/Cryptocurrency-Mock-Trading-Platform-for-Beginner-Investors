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
   private final BoardService boardService;         // 게시글 관련 서비스
   private final CommentService commentService;     // 댓글 관련 서비스
   
   @GetMapping  // 게시글 목록 조회
   public ResponseEntity<?> getAllBoards(HttpSession session){
       try {
           return ResponseEntity.ok(boardService.getAllBoards(session));  // 세션 정보를 포함하여 목록 조회
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
   
   @GetMapping("/{id}")  // 게시글 상세 조회
   public ResponseEntity<?> getBoard(@PathVariable("id") Long id, HttpSession session) {
       try {
           return ResponseEntity.ok(boardService.getBoard(id, session));  // ID로 게시글 조회
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
   
   @PostMapping  // 새 게시글 작성
   public ResponseEntity<?> createBoard(@RequestBody BoardDTO board, HttpSession session) {
       try {
           return ResponseEntity.ok(boardService.createBoard(board, session));
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
   
   @PutMapping("/{id}")  // 게시글 수정
   public ResponseEntity<?> updateBoard(@PathVariable("id") Long id, @RequestBody BoardDTO board, HttpSession session) {
       try {
           return ResponseEntity.ok(boardService.updateBoard(id, board, session));
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
   
   @PostMapping("/{id}/like")  // 게시글 좋아요
   public ResponseEntity<?> likeBoard(@PathVariable("id") Long id, HttpSession session){
       try {
           boardService.likeBoard(id,session);
           return ResponseEntity.ok().build();
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
   
   @DeleteMapping("/{id}")  // 게시글 삭제
   public ResponseEntity<?> deleteBoard(@PathVariable("id") Long id, HttpSession session){
       try {
           boardService.deleteBoard(id, session);
           return ResponseEntity.ok().build();
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
   
   @PostMapping("/{boardId}/comments")  // 댓글 작성
   public ResponseEntity<?> createComment(@PathVariable("boardId") Long boardId, @RequestBody CommentDTO commentDto, HttpSession session) {
       try {
           return ResponseEntity.ok(commentService.createComment(boardId, commentDto, session));
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

   @PutMapping("/comments/{id}")  // 댓글 수정
   public ResponseEntity<?> updateComment(@PathVariable("id") Long id, @RequestBody CommentDTO commentDto, HttpSession session) {
       try {
           return ResponseEntity.ok(commentService.updateComment(id, commentDto, session));
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }

   @DeleteMapping("/comments/{id}")  // 댓글 삭제
   public ResponseEntity<?> deleteComment(@PathVariable("id") Long id, HttpSession session) {
       try {
           commentService.deleteComment(id, session);
           return ResponseEntity.ok().build();
       } catch (RuntimeException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }
}