// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 회원가입 API
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// 로그인 API
export const login = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, loginData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || '로그인 중 오류가 발생했습니다.');
    }
};

export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/info`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || '사용자 정보를 불러오는데 실패했습니다.');
    }
};

export const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
    } catch (error) {
        throw new Error('로그아웃 중 오류가 발생했습니다.');
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await axios.put(`${API_URL}/user/password`, passwordData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
        }
        throw new Error(error.response?.data || '비밀번호 변경 중 오류가 발생했습니다.');
    }
};

export const updateStyle = async (style, score) => {
    try {
        const response = await axios.put(`${API_URL}/user/style`, {
            style,
            score
        }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || '투자 성향 업데이트 중 오류가 발생했습니다.');
    }
};

export const checkSession = async () => {
    try {
        const response = await axios.get(`${API_URL}/check-session`);
        return response.data;
    } catch (error) {
        throw error;
    }
};