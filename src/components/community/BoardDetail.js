import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from "dayjs";
import './BoardDetail.css';

function BoardDetail() {
    const [board, setBoard] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { id } = useParams();
	const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [editingCommentId, setEditingCommentId] = useState(null);
	const [editedCommentContent, setEditedCommentContent] = useState('');

    useEffect(() => {
        fetchBoard();
		checkLoginStatus();
    }, []);
	const checkLoginStatus = async () => {
	    try {
	        const response = await axios.get('http://localhost:8080/api/check-session', {
	            withCredentials: true
	        });
	        setIsLoggedIn(!!response.data);
	    } catch (error) {
	        setIsLoggedIn(false);
	    }
	};
	// 게시글 수정 시작
    const startEditing = () => {
        setEditedTitle(board.title);
        setEditedContent(board.content);
        setIsEditing(true);
    };

    // 게시글 수정 취소
    const cancelEditing = () => {
        setIsEditing(false);
        setEditedTitle('');
        setEditedContent('');
    };

    // 게시글 수정 저장
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/boards/${id}`, {
                title: editedTitle,
                content: editedContent
            }, {
                withCredentials: true
            });
            setIsEditing(false);
            fetchBoard();
        } catch (error) {
            alert('게시글 수정 실패: ' + error.response?.data || '알 수 없는 오류 발생');
        }
    };

    // 게시글 삭제
    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8080/api/boards/${id}`, {
                    withCredentials: true
                });
                alert('게시글이 삭제되었습니다.');
                navigate('/boards');
            } catch (error) {
                alert('게시글 삭제 실패: ' + error.response?.data || '알 수 없는 오류 발생');
            }
        }
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentId) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8080/api/boards/comments/${commentId}`, {
                    withCredentials: true
                });
                fetchBoard();
            } catch (error) {
                alert('댓글 삭제 실패: ' + error.response?.data || '알 수 없는 오류 발생');
            }
        }
    };
	// 댓글 수정 모드 시작
	const startCommentEdit = (comment) => {
	    setEditingCommentId(comment.id);
	    setEditedCommentContent(comment.content);
	};

	// 댓글 수정 취소
	const cancelCommentEdit = () => {
	    setEditingCommentId(null);
	    setEditedCommentContent('');
	};

	// 댓글 수정 저장
	const handleCommentUpdate = async (commentId) => {
	    try {
	        await axios.put(`http://localhost:8080/api/boards/comments/${commentId}`, {
	            content: editedCommentContent
	        }, {
	            withCredentials: true
	        });
	        setEditingCommentId(null);
	        fetchBoard();
	    } catch (error) {
	        alert('댓글 수정 실패: ' + error.response?.data || '알 수 없는 오류 발생');
	    }
	};

	
    const fetchBoard = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/boards/${id}`, {
                withCredentials: true
            });
			
			console.log('게시글 데이터:', response.data);  
	        console.log('작성자:', response.data.username);
	        console.log('현재 사용자가 작성자인지:', response.data.isAuthor);

            setBoard(response.data);
            setComments(response.data.comments || []);
        } catch (error) {
            console.error('Failed to fetch board:', error);
        }
    };

	const handleLike = async () => {
	    if (!isLoggedIn) {
	        alert('로그인이 필요한 서비스입니다.');
	        navigate('/login');
	        return;
	    }
	    try {
	        await axios.post(`http://localhost:8080/api/boards/${id}/like`, {}, {
	            withCredentials: true
	        });
	        fetchBoard();
	    } catch (error) {
	        console.error('Failed to like board:', error);
	    }
	};

	const handleComment = async (e) => {
	    e.preventDefault();
	    if (!isLoggedIn) {
	        alert('로그인이 필요한 서비스입니다.');
	        navigate('/login');
	        return;
	    }
	    try {
	        await axios.post(`http://localhost:8080/api/boards/${id}/comments`, {
	            content: newComment
	        }, {
	            withCredentials: true
	        });
	        setNewComment('');
	        fetchBoard();
	    } catch (error) {
	        console.error('Failed to add comment:', error);
	    }
	};

	return (
	        <div className="board-detail-container">
	            {board && (
	                <>
	                    {!isEditing ? (
	                        // 조회 모드
	                        <>
	                            <div className="board-header">
	                                <h2>{board.title}</h2>
	                                <div className="board-info">
	                                    <span>작성자: {board.nickname}</span>
	                                    <span>조회수: {board.viewCount}</span>
	                                    <span>추천수: {board.likeCount}</span>
	                                    <span>작성일: {dayjs(board.createdAt).format("YYYY-MM-DD HH:mm:ss")}</span>
	                                </div>
	                            </div>
	                            <div className="board-content">{board.content}</div>
	                            <div className="board-actions">
	                                <button onClick={handleLike}>추천</button>
	                                {board.author && (
	                                    <>
	                                        <button onClick={startEditing}>수정</button>
	                                        <button onClick={handleDelete}>삭제</button>
	                                    </>
	                                )}
	                            </div>
	                        </>
	                    ) : (
	                        // 수정 모드
	                        <div className="board-edit">
	                            <input
	                                type="text"
	                                value={editedTitle}
	                                onChange={(e) => setEditedTitle(e.target.value)}
	                                className="edit-title"
	                            />
	                            <textarea
	                                value={editedContent}
	                                onChange={(e) => setEditedContent(e.target.value)}
	                                className="edit-content"
	                            />
	                            <div className="edit-actions">
	                                <button onClick={handleUpdate}>저장</button>
	                                <button onClick={cancelEditing}>취소</button>
	                            </div>
	                        </div>
	                    )}

	                    {/* 댓글 섹션 */}
	                    <div className="comments-section">
	                        <h3>댓글</h3>
	                        <form onSubmit={handleComment}>
	                            <textarea
	                                value={newComment}
	                                onChange={(e) => setNewComment(e.target.value)}
	                                placeholder="댓글을 입력하세요"
	                            />
	                            <button type="submit">댓글 작성</button>
	                        </form>
	                        <div className="comments-list">
							{comments.map(comment => (
							    <div key={comment.id} className="comment">
							        <div className="comment-header">
							            <span>{comment.nickname}</span>
							            <span>{dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm:ss")}</span>
							        </div>
							        {editingCommentId === comment.id ? (
							            // 댓글 수정 모드
							            <div className="comment-edit">
							                <textarea
							                    value={editedCommentContent}
							                    onChange={(e) => setEditedCommentContent(e.target.value)}
							                    className="edit-comment"
							                />
							                <div className="comment-actions">
							                    <button onClick={() => handleCommentUpdate(comment.id)}>저장</button>
							                    <button onClick={cancelCommentEdit}>취소</button>
							                </div>
							            </div>
							        ) : (
							            // 댓글 조회 모드
							            <>
							                <div className="comment-content">{comment.content}</div>
							                {comment.author && (
							                    <div className="comment-actions">
							                        <button onClick={() => startCommentEdit(comment)}>수정</button>
							                        <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
							                    </div>
							                )}
							            </>
							        )}
							    </div>
							))}
	                        </div>
	                    </div>
	                </>
	            )}
	        </div>
	    );
	}

export default BoardDetail;