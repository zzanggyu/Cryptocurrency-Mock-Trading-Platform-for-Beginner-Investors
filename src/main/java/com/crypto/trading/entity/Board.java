package com.crypto.trading.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "boards")
@Getter @Setter
@NoArgsConstructor
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                     // 게시글 고유 ID
    private String title;                // 게시글 제목
    private String content;              // 게시글 내용
    
    @ManyToOne(fetch = FetchType.LAZY)  // 다대일 관계: 한 사용자가 여러 게시글 작성 가능
    @JoinColumn(name = "user_id")
    private User user;                   // 작성자 정보
    
    private int viewCount;               // 조회수
    private int likeCount;               // 좋아요 수
    private LocalDateTime createdAt;     // 작성일시
    
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)  // 일대다 관계: 한 게시글에 여러 댓글
    private List<Comment> comments = new ArrayList<>();         // 댓글 목록
    
    @ElementCollection                   // 좋아요 누른 사용자 ID 컬렉션
    @CollectionTable(
            name = "board_likes",
            joinColumns = @JoinColumn(name = "board_id")
    )
    @Column(name = "user_id")
    private Set<Long> likedUsers = new HashSet<>();
    
    @PrePersist
    protected void onCreate() {          // 게시글 생성 시 현재 시간 자동 설정
        createdAt = LocalDateTime.now();
    }
    
    public boolean hasUserLiked(Long userId) {    // 사용자가 이미 좋아요를 눌렀는지 확인
        return likedUsers.contains(userId);
    }
    
    public void addLike(Long userId) {            // 좋아요 추가
        if(likedUsers.add(userId)) {
            likeCount++;
        }
    }
}