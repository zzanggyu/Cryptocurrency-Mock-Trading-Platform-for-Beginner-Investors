import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setErrorMessage('아이디를 입력해주세요.');
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            setErrorMessage('유효한 이메일을 입력해주세요.');
            return false;
        }
        if (formData.password.length < 6) {
            setErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            alert('회원가입이 완료되었습니다!');
            window.location.href = '/'; // 홈으로 리디렉트
        } catch (error) {
            setErrorMessage(error.response?.data?.message || '회원가입 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 mb-2">아이디</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2">이메일</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2">비밀번호</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                    placeholder="6자 이상 입력해주세요"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2">비밀번호 확인</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>

            {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                disabled={loading}
            >
                {loading ? '가입 중...' : '회원가입'}
            </button>
        </form>
    );
};

export default SignupForm;