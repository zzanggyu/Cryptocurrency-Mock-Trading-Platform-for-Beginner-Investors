import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const NewsService = {
   getNews: async (page = 0, size = 10) => {
       try {
           const response = await axios.get(`${BASE_URL}/news?page=${page}&size=${size}`);
           return response.data;
       } catch (error) {
           console.error('뉴스를 불러오는데 실패했습니다:', error);
           throw error;
       }
   },

   searchNews: async (keyword, page = 0, size = 10) => {
       try {
           const response = await axios.get(
               `${BASE_URL}/news/search?keyword=${keyword}&page=${page}&size=${size}`
           );
           return response.data;
       } catch (error) {
           console.error('뉴스 검색에 실패했습니다:', error);
           throw error;
       }
   },

   getNewsByCategory: async (category, page = 0, size = 10) => {
    try {
        const encodedCategory = encodeURIComponent(category); // <-- URL 인코딩 추가
        console.log(`카테고리 API 요청: ${category}, 페이지: ${page}`);
       const response = await axios.get(
            `${BASE_URL}/news/search?category=${encodedCategory}&page=${page}&size=${size}`
        );
        console.log('카테고리 API 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('카테고리별 뉴스 조회에 실패했습니다:', error.response?.data || error);
        throw error;
    }
}
};

export default NewsService;