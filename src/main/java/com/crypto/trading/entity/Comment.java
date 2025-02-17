package com.crypto.trading.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "comments")
@NoArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                     // 댓글 고유 ID
    private String content;              // 댓글 내용
    
    @ManyToOne(fetch = FetchType.LAZY)  // 다대일 관계: 한 게시글에 여러 댓글
    @JoinColumn(name = "board_id")
    private Board board;                 // 댓글이 달린 게시글
    
    @ManyToOne(fetch = FetchType.LAZY)  // 다대일 관계: 한 사용자가 여러 댓글 작성 가능
    @JoinColumn(name = "user_id")
    private User user;                   // 댓글 작성자
    
    private LocalDateTime createdAt;     // 작성일시
    
    @PrePersist
    protected void onCreate() {          // 댓글 생성 시 현재 시간 자동 설정
        this.createdAt = LocalDateTime.now();
    }
}