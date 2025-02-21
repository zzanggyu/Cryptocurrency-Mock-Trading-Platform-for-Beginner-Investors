package com.crypto.trading.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.dto.CommentDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.entity.Board;
import com.crypto.trading.entity.Comment;
import com.crypto.trading.entity.User;
import com.crypto.trading.exception.BoardException;
import com.crypto.trading.repository.BoardRepository;
import com.crypto.trading.repository.CommentRepository;
import com.crypto.trading.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
   private final CommentRepository commentRepository;
   private final BoardRepository boardRepository;
   private final UserRepository userRepository;
   
   // 댓글 엔티티를 DTO로 변환
   private CommentDTO convertToDto(Comment comment) {
       CommentDTO dto = new CommentDTO();
       dto.setId(comment.getId());
       dto.setContent(comment.getContent());
       dto.setUsername(comment.getUser().getUsername());
       dto.setCreatedAt(comment.getCreatedAt());
       return dto;
   }
   
   // 댓글 내용 검사
   private void validateCommentContent(String content) {
	   if(content == null || content.trim().isEmpty()) {
		   throw new RuntimeException("댓글 내용을 입력해주세요");
	   }
   }
   
   // 새 댓글 작성
   @Transactional
   public CommentDTO createComment(Long boardId, CommentDTO commentDto, HttpSession session) {
	   validateCommentContent(commentDto.getContent());
	   
       // 게시글 존재 여부 확인
       Board board = BoardException.validateBoard(boardRepository.findById(boardId));
       // 현재 로그인한 사용자 정보 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       User loginuser = BoardException.validateLoginUser(userRepository.findByUsername(user.getUsername()));
       
       // 새 댓글 엔티티 생성 및 저장
       Comment comment = new Comment();
       comment.setContent(commentDto.getContent());
       comment.setBoard(board);
       comment.setUser(loginuser);
       
       return convertToDto(commentRepository.save(comment));
   }
   
   // 댓글 수정
   @Transactional
   public CommentDTO updateComment(Long id, CommentDTO commentDTO, HttpSession session) {
       // 댓글 존재 여부 확인
       Comment comment = BoardException.validateComment(commentRepository.findById(id));
       // 현재 로그인한 사용자 정보 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       // 작성자와 현재 사용자가 같은지 확인
       BoardException.validateUser(comment.getUser().getUsername(), user.getUsername());
       
       // 댓글 내용 업데이트
       comment.setContent(commentDTO.getContent());
       return convertToDto(comment);
   }
   
   // 댓글 삭제
   @Transactional
   public void deleteComment(Long id, HttpSession session) {
       // 댓글 존재 여부 확인
       Comment comment = BoardException.validateComment(commentRepository.findById(id));
       // 현재 로그인한 사용자 정보 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       // 작성자와 현재 사용자가 같은지 확인
       BoardException.validateUser(comment.getUser().getUsername(), user.getUsername());
       
       // 댓글 삭제
       commentRepository.delete(comment);
   }
}