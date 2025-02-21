import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess }) => {  // onLoginSuccess prop 추가
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 로컬스토리지에서 이미 로그인 정보가 있는지 확인
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        
        if (storedToken && storedUsername) {
            // 로그인 상태가 유지될 수 있도록 설정
            onLoginSuccess(storedUsername);
        }
    }, [onLoginSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            // 로그인 성공 시 토큰과 사용자 이름을 로컬스토리지에 저장
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            
            // 로그인 성공 처리
            onLoginSuccess(response.data.username);
            
        } catch (error) {
            setErrorMessage(error.response?.data?.message || '로그인 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">아이디</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                {errorMessage && (
                    <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
                )}
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
