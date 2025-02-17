import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import './BoardList.css';

function BoardList() {
    const [boards, setBoards] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBoards();
		checkLoginStatus();
    }, []);

    const fetchBoards = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/boards', {
                withCredentials: true
            });
            setBoards(response.data);
        } catch (error) {
            console.error('Failed to fetch boards:', error);
        }
    };
	
	// checkLoginStatus 함수 추가
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

	// 글쓰기 버튼 클릭 핸들러 추가
	const handleWriteClick = () => {
	    if (!isLoggedIn) {
	        alert('로그인이 필요한 서비스입니다.');
	        navigate('/login');
	        return;
	    }
	    navigate('/boards/write');
	};

    return (
        <div className="board-list-container">
            <div className="board-list-header">
                <h2>커뮤니티</h2>
                <button 
                    className="write-button"
                    onClick={handleWriteClick}
                >
                    글쓰기
                </button>
            </div>
            <table className="board-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th className="title-column">제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>추천수</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {boards.map(board => (
                        <tr 
                            key={board.id} 
                            onClick={() => navigate(`/boards/${board.id}`)}
                        >
                            <td>{board.id}</td>
                            <td>{board.title}</td>
                            <td>{board.nickname}</td>
                            <td>{board.viewCount}</td>
                            <td>{board.likeCount}</td>
                            <td>{dayjs(board.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BoardList;