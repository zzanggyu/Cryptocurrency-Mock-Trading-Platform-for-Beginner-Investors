import axios from 'axios';
import { sign } from 'jsonwebtoken';

const UPBIT_API_URL = 'https://api.upbit.com/v1';
const ACCESS_KEY = 'whAZXRdnvkk0Vi33H9LqvHwYv5QztR0mAmGaNGoO';
const SECRET_KEY = '2MCIkn1PFMeTW22bhLlOqTz5yXp10k2XmUXgDoJv';

// API 요청에 필요한 인증 헤더 생성
const getAuthorizationToken = () => {
    const payload = {
        access_key: ACCESS_KEY,
        nonce: new Date().getTime()
    };
    const token = sign(payload, SECRET_KEY);
    return `Bearer ${token}`;
};

// 시세 조회 API
export const getTicker = async (markets) => {
    try {
        const response = await axios.get(`${UPBIT_API_URL}/ticker`, {
            params: { markets },
            headers: {
                Authorization: getAuthorizationToken()
            }
        });
        return response.data;
    } catch (error) {
        console.error('Upbit API 조회 실패:', error);
        throw error;
    }
};