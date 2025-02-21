// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

function Login({setUser}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
        try {
            const response = await login(formData);
            setUser(response);  // 로그인 성공시 사용자 정보 저장
            alert('로그인 성공!');
            navigate('/');
        } catch (error) {
            alert(error.message || '로그인 중 오류가 발생했습니다.');
        }

	};

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>로그인</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="사용자명"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                        required
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}

export default Login;