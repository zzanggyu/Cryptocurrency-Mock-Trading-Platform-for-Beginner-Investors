package com.crypto.trading.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.dto.BoardDTO;
import com.crypto.trading.dto.CommentDTO;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.entity.Board;
import com.crypto.trading.entity.User;
import com.crypto.trading.exception.BoardException;
import com.crypto.trading.repository.BoardRepository;
import com.crypto.trading.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // 기본적으로 읽기 전용 트랜잭션 사용
public class BoardService {
   private final UserRepository userRepository;
   private final BoardRepository boardRepository;
  
   // 게시글 엔티티를 DTO로 변환 (현재 로그인한 사용자 정보 포함)
   private BoardDTO convertToDto(Board board, HttpSession session) {
       // 현재 로그인한 사용자 정보 세션에서 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       System.out.println("Session User: " + (user != null ? user.getUsername() : "null"));
       System.out.println("Board User: " + board.getUser().getUsername());

       // BoardDTO 생성 및 데이터 설정
       BoardDTO dto = new BoardDTO();
       dto.setId(board.getId());
       dto.setTitle(board.getTitle());
       dto.setContent(board.getContent());
       dto.setUsername(board.getUser().getUsername());    // 작성자 아이디
       dto.setNickname(board.getUser().getNickname());   // 작성자 닉네임
       dto.setViewCount(board.getViewCount());           // 조회수
       dto.setLikeCount(board.getLikeCount());          // 좋아요 수
       dto.setCreatedAt(board.getCreatedAt());          // 작성일시
       // 현재 로그인한 사용자가 작성자인지 여부 설정
       dto.setAuthor(user != null && user.getUsername().equals(board.getUser().getUsername()));
      
       // 댓글 목록도 DTO로 변환하여 설정
       dto.setComments(
           board.getComments().stream()
           .map(comment -> {
               CommentDTO commentDto = new CommentDTO();
               commentDto.setId(comment.getId());
               commentDto.setContent(comment.getContent());
               commentDto.setUsername(comment.getUser().getUsername());
               commentDto.setNickname(comment.getUser().getNickname());
               commentDto.setCreatedAt(comment.getCreatedAt());
               // 댓글 작성자가 현재 로그인한 사용자인지 여부 설정
               commentDto.setAuthor(user != null && user.getUsername().equals(comment.getUser().getUsername()));
               return commentDto;
           })
           .collect(Collectors.toList())
       );
       return dto;
   }
  
   // 새 게시글 작성
   @Transactional
   public BoardDTO createBoard(BoardDTO boardDto, HttpSession session) {
       // 세션에서 로그인한 사용자 정보 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       User loginuser = BoardException.validateLoginUser(userRepository.findByUsername(user.getUsername()));
      
       // 새 게시글 엔티티 생성 및 저장
       Board board = new Board();
       board.setTitle(boardDto.getTitle());
       board.setContent(boardDto.getContent());
       board.setUser(loginuser);
      
       return convertToDto(boardRepository.save(board), session);
   }
  
   // 게시글 상세 조회 (조회수 증가 포함)
   @Transactional
   public BoardDTO getBoard(Long id, HttpSession session) {
       // ID로 게시글 조회
       Board board = boardRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
      
       // 조회수 증가
       board.setViewCount(board.getViewCount() + 1);
      
       return convertToDto(board, session);
   }
  
   // 게시글 목록 조회 (최신순)
   public List<BoardDTO> getAllBoards(HttpSession session) {
       return boardRepository.findAllByOrderByCreatedAtDesc().stream()
               .map(board -> convertToDto(board, session))
               .collect(Collectors.toList());
   }
  
   // 게시글 수정
   @Transactional
   public BoardDTO updateBoard(Long id, BoardDTO boardDTO, HttpSession session) {
       // 게시글 존재 여부 확인
       Board board = BoardException.validateBoard(boardRepository.findById(id));
       // 현재 로그인한 사용자 정보 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");        
       // 작성자와 현재 사용자가 같은지 확인
       BoardException.validateUser(board.getUser().getUsername(), user.getUsername());
      
       // 게시글 내용 업데이트
       board.setTitle(boardDTO.getTitle());
       board.setContent(boardDTO.getContent());
       return convertToDto(board, session);
   }
  
   // 게시글 삭제
   @Transactional
   public void deleteBoard(Long id, HttpSession session) {
       // 게시글 존재 여부 확인
       Board board = BoardException.validateBoard(boardRepository.findById(id));
       // 현재 로그인한 사용자 정보 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");        
       // 작성자와 현재 사용자가 같은지 확인
       BoardException.validateUser(board.getUser().getUsername(), user.getUsername());
      
       // 게시글 삭제
       boardRepository.delete(board);
   }
  
   // 게시글 좋아요
   @Transactional
   public void likeBoard(Long id, HttpSession session) {
       // 게시글 조회
       Board board = boardRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
      
       // 현재 로그인한 사용자 정보 가져오기
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
      
       // 이미 좋아요를 눌렀는지 확인
       if(board.hasUserLiked(user.getUserId())) {
           throw new RuntimeException("이미 추천하셨습니다.");
       }
      
       // 좋아요 추가
       board.addLike(user.getUserId());
   }
}