import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardWrite.css';

function BoardWrite() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/boards', {
                title,
                content
            }, {
                withCredentials: true
            });
            navigate('/boards');
        } catch (error) {
            console.error('Failed to create board:', error);
        }
    };

    return (
        <div className="board-write-container">
            <h2>글쓰기</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="submit">작성</button>
                    <button type="button" onClick={() => navigate('/boards')}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default BoardWrite;