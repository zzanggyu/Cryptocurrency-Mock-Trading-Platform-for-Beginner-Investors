import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const NewsCard = ({ news, onKeywordClick, refreshNews }) => {
   const [isFavorite, setIsFavorite] = useState(false);
   // 토큰 체크를 함수로 분리
   const checkIsLoggedIn = () => {
       const token = localStorage.getItem('token');
       return token && token.length > 0;
   };

   // 컴포넌트 마운트시 관심 뉴스 상태 체크
   useEffect(() => {
       const checkFavoriteStatus = async () => {
           if (!checkIsLoggedIn()) return;
           
           try {
               const token = localStorage.getItem('token');
               const response = await axios.get(
                   `http://localhost:8080/api/news/favorites`,
                   {
                       headers: { 
                           'Authorization': `Bearer ${token}`,
                           'Content-Type': 'application/json'
                       }
                   }
               );
               
               const favorites = response.data.content;
               setIsFavorite(favorites.some(favorite => favorite.id === news.id));
           } catch (error) {
               console.error('관심 뉴스 상태 확인 실패:', error);
               console.error('Error details:', error.response?.data);
           }
       };

       checkFavoriteStatus();
   }, [news.id]);

   const handleClick = () => {
       window.open(news.url, '_blank');
   };

   const handleKeywordClick = (keyword) => {
       onKeywordClick(keyword);
   };

   const handleFavoriteClick = async (e) => {
       e.stopPropagation();
       if (!checkIsLoggedIn()) {
           alert('로그인이 필요한 기능입니다.');
           return;
       }

       try {
           const token = localStorage.getItem('token');
           console.log('Sending request with token:', token); // 토큰 확인용 로그
           const response = await axios.post(
               `http://localhost:8080/api/news/${news.id}/favorite`,
               {},
               {
                   headers: { 
                       'Authorization': `Bearer ${token}`,
                       'Content-Type': 'application/json'
                   }
               }
           );
           console.log('Response:', response.data); // 응답 확인용 로그
           setIsFavorite(response.data.isFavorite);
           if (refreshNews) {
               refreshNews();
           }
       } catch (error) {
           console.error('관심 뉴스 설정 실패:', error);
           console.error('Error response:', error.response?.data);
           alert('관심 뉴스 설정에 실패했습니다.');
       }
   };

   const displayedKeywords = news.keywords?.slice(0, 5);
   const remainingCount = news.keywords?.length - 5;

   return (
    <div className="border-b border-gray-200 py-4">
    <div 
        className="flex space-x-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleClick}
    >
        <div className="flex-shrink-0">
            <img
                src={news.imageUrl || '/api/placeholder/200/200'}
                alt={news.title}
                className="w-32 h-24 object-cover rounded" 
            />
        </div>
        <div className="flex-grow relative">
            <button 
                onClick={handleFavoriteClick}
                className={`absolute top-0 right-0 p-1 transition-colors ${
                    isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'
                }`}
            >
                <svg 
                    className="w-4 h-4" 
                    fill={isFavorite ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            </button>
            <div className="flex items-center space-x-2 mb-1"> 
                {news.categories?.map((category, index) => (
                    <React.Fragment key={category}>
                        <span className="text-xs text-gray-600">{category}</span> 
                        {index < news.categories.length - 1 && (
                            <span className="text-xs text-gray-400">•</span> 
                        )}
                    </React.Fragment>
                ))}
                <span className="text-xs text-gray-400">•</span> 
                <span className="text-xs text-gray-600"> 
                    {format(new Date(news.publishDate), 'yyyy-MM-dd HH:mm')}
                </span>
            </div>
            <h2 className="text-base font-bold mb-1 text-gray-900">{news.title}</h2> 
            <p className="text-sm text-gray-600 line-clamp-2">{news.content}</p>
        </div>
    </div>
    
    <div className="mt-2 flex items-center space-x-4 px-4"> 
        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {news.author}
        </div>
        <div className="flex flex-wrap gap-1"> 
            {displayedKeywords?.map((keyword, index) => (
                <span
                    key={index}
                    className="px-1.5 py-0.5 bg-gray-100 text-xs text-gray-600 rounded hover:bg-blue-100 cursor-pointer" 
                    onClick={() => handleKeywordClick(keyword)}
                >
                    #{keyword}
                </span>
            ))}
            {remainingCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs text-gray-500"> 
                    +{remainingCount}
                </span>
            )}
        </div>
    </div>
</div>
   );
};

export default NewsCard;