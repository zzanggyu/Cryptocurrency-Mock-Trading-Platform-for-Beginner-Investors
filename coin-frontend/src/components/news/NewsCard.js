import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import './NewsCard.css';

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
           const token = localStorage.getItem('token');
           if (!token) return;
           
           try {
               console.log('Checking favorite status with token:', token);
               const response = await axios.get(
                   `http://localhost:8080/api/news/favorites`,
                   {
                       headers: { 
                           'Authorization': `Bearer ${token}`,
                           'Content-Type': 'application/json'
                       },
                       withCredentials: true
                   }
               );
               
               console.log('Favorites response:', response.data);
               if (response.data && response.data.content) {
                   const favorites = response.data.content;
                   setIsFavorite(favorites.some(favorite => favorite.id === news.id));
               }
           } catch (error) {
               console.error('관심 뉴스 상태 확인 실패:', error);
               console.error('Error details:', error.response?.data);
               if (error.response?.status === 401) {
                   localStorage.removeItem('token'); // 토큰이 유효하지 않으면 제거
               }
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
       // 토큰 체크
       const token = localStorage.getItem('token');
       
       if (!token) {
           alert('로그인이 필요한 기능입니다.');
           return;
       }

       try {
           console.log('Token:', token); // 토큰 값 확인
           const response = await axios.post(
               `http://localhost:8080/api/news/${news.id}/favorite`,
               {},
               {
                   headers: { 
                       'Authorization': `Bearer ${token}`,
                       'Content-Type': 'application/json'
                   },
                   withCredentials: true  // 쿠키를 포함한 요청 설정
               }
           );
           
           console.log('Favorite response:', response.data); // 응답 데이터 확인
           
           if (response.data && typeof response.data.isFavorite === 'boolean') {
               setIsFavorite(response.data.isFavorite);
               if (refreshNews) {
                   refreshNews();
               }
           } else {
               console.error('Unexpected response format:', response.data);
           }
       } catch (error) {
           console.error('관심 뉴스 설정 실패:', error);
           console.error('Error response:', error.response?.data);
           console.error('Error status:', error.response?.status);
           if (error.response?.status === 401) {
               alert('로그인이 필요하거나 세션이 만료되었습니다.');
               // 여기서 로그아웃 처리나 토큰 갱신 로직을 추가할 수 있습니다
           } else {
               alert('관심 뉴스 설정에 실패했습니다.');
           }
       }
   };

   const displayedKeywords = news.keywords?.slice(0, 5);
   const remainingCount = news.keywords?.length - 5;

   // NewsCard.js
   return (
       <div className="newscard">
           <div 
               className="newscard-content"
               onClick={handleClick}
           >
               <div className="newscard-image">
                   <img
                       src={news.imageUrl || '/api/placeholder/200/200'}
                       alt={news.title}
                   />
               </div>
               <div className="newscard-details">
                   <button 
                       onClick={handleFavoriteClick}
                       className={`newscard-favorite ${isFavorite ? 'active' : 'inactive'}`}
                   >
                       <svg 
                           viewBox="0 0 24 24"
                           fill={isFavorite ? "currentColor" : "none"} 
                           stroke="currentColor" 
                       >
                           <path 
                               strokeLinecap="round" 
                               strokeLinejoin="round" 
                               strokeWidth="2" 
                               d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                           />
                       </svg>
                   </button>
                   <div className="newscard-meta">
                       {news.categories?.map((category, index) => (
                           <React.Fragment key={category}>
                               <span className="newscard-category">{category}</span>
                               {index < news.categories.length - 1 && (
                                   <span className="newscard-separator">•</span>
                               )}
                           </React.Fragment>
                       ))}
                       <span className="newscard-separator">•</span>
                       <span className="newscard-date">
                           {format(new Date(news.publishDate), 'yyyy-MM-dd HH:mm')}
                       </span>
                   </div>
                   <h2 className="newscard-title">{news.title}</h2>
                   <p className="newscard-content">{news.content}</p>
               </div>
           </div>

           <div className="newscard-keywords">
               <div className="newscard-author">
                   {news.author}
               </div>
               <div className="newscard-tags">
                   {displayedKeywords?.map((keyword, index) => (
                       <span
                           key={index}
                           className="newscard-tag"
                           onClick={() => handleKeywordClick(keyword)}
                       >
                           #{keyword}
                       </span>
                   ))}
                   {remainingCount > 0 && (
                       <span className="newscard-tag-more">
                           +{remainingCount}
                       </span>
                   )}
               </div>
           </div>
       </div>
   );
};

export default NewsCard;