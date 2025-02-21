import axios from 'axios';
import CryptoJS from 'crypto-js';

const UPBIT_API_URL = 'https://api.upbit.com/v1';

// 🔥 API 키를 직접 코드에 포함 (보안상 주의 필요)
const ACCESS_KEY = 'whAZXRdnvkk0Vi33H9LqvHwYv5QztR0mAmGaNGoO';
const SECRET_KEY = '2MCIkn1PFMeTW22bhLlOqTz5yXp10k2XmUXgDoJv';

// API 요청에 필요한 인증 헤더 생성
const getAuthorizationToken = () => {
    if (!ACCESS_KEY || !SECRET_KEY) {
        console.error("❌ API 키가 설정되지 않았습니다!");
        return null;
    }

    const nonce = new Date().getTime();
    const payload = {
        access_key: ACCESS_KEY,
        nonce: nonce
    };

    try {
        const signature = CryptoJS.HmacSHA512(JSON.stringify(payload), SECRET_KEY).toString();
        return `Bearer ${signature}`;
    } catch (error) {
        console.error("Signature 생성 실패:", error);
        return null;
    }
};

export const getTicker = async () => {
    const markets = ['KRW-BTC', 'KRW-ETH', 'KRW-XRP', 'KRW-SOL', 'KRW-TRX'].join(',');

    try {
        const response = await axios.get('/v1/ticker', {  // 프록시를 통한 요청
            params: { markets }
        });

        console.log('Upbit API 응답:', response.data); // 응답 데이터 확인
        return response.data;
    } catch (error) {
        console.error('Upbit API 조회 실패:', error);
        return [];
    }
};

