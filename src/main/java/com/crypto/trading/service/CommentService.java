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
	
	private CommentDTO convertToDto(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUsername(comment.getUser().getUsername());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
	
	@Transactional
	public CommentDTO createComment(Long boardId, CommentDTO commentDto, HttpSession session) {
		Board board = BoardException.validateBoard(boardRepository.findById(boardId));
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		User loginuser = BoardException.validateLoginUser(userRepository.findByUsername(user.getUsername()));
		
		Comment comment = new Comment();
		comment.setContent(commentDto.getContent());
		comment.setBoard(board);
		comment.setUser(loginuser);
		
		return convertToDto(commentRepository.save(comment));
	}
	
	@Transactional
	public CommentDTO updateComment(Long id, CommentDTO commentDTO, HttpSession session) {
		Comment comment = BoardException.validateComment(commentRepository.findById(id));
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		BoardException.validateUser(comment.getUser().getUsername(), user.getUsername());
		
		comment.setContent(commentDTO.getContent());;
		return convertToDto(comment);
	}
	
	@Transactional
	public void deleteComment(Long id, HttpSession session) {
		Comment comment = BoardException.validateComment(commentRepository.findById(id));
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		BoardException.validateUser(comment.getUser().getUsername(), user.getUsername());
		
		commentRepository.delete(comment);
	}
}
