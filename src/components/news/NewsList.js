import React, { useState, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';
import axios from 'axios';
import './NewsList.css';

const NewsList = () => {
   const [news, setNews] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedCategory, setSelectedCategory] = useState('전체 뉴스');
   const [searchTerm, setSearchTerm] = useState('');
   const [actualSearchTerm, setActualSearchTerm] = useState('');
   const [selectedKeywords, setSelectedKeywords] = useState([]);
   const [currentPage, setCurrentPage] = useState(0);
   const [hasMore, setHasMore] = useState(true);
   const isLoggedIn = !!localStorage.getItem('token');
   const [prevNews, setPrevNews] = useState([]); // 이전 데이터 저장용 state 추가

   const categories = [
       '전체 뉴스', '관심 뉴스', 'Digital Asset', 'Market', 'Finance',
       'Policy', 'Research', 'Stories For U', '이슈', '테크', '비즈니스',
       '피플', '분석과 전망', 'Press', 'Chain&Coin', 'Block TV'
   ];

   const fetchNews = useCallback(async () => {
       try {
           if (currentPage === 0) {
              setPrevNews(news); // 새로운 카테고리로 변경 시 이전 데이터 저장
           }
           setLoading(true);
           let response;
           const pageSize = 10;

           const requestUrl = selectedCategory === '관심 뉴스' 
               ? actualSearchTerm 
                   ? `http://localhost:8080/api/news/favorites/search?page=${currentPage}&size=${pageSize}&keyword=${encodeURIComponent(actualSearchTerm)}`
                   : `http://localhost:8080/api/news/favorites?page=${currentPage}&size=${pageSize}`
               : selectedCategory !== '전체 뉴스' && actualSearchTerm
                   ? `http://localhost:8080/api/news/search?category=${encodeURIComponent(selectedCategory)}&keyword=${encodeURIComponent(actualSearchTerm)}&page=${currentPage}&size=${pageSize}`
                   : selectedCategory !== '전체 뉴스'
                       ? `http://localhost:8080/api/news/search?category=${encodeURIComponent(selectedCategory)}&page=${currentPage}&size=${pageSize}`
                       : actualSearchTerm
                           ? `http://localhost:8080/api/news/search?keyword=${encodeURIComponent(actualSearchTerm)}&page=${currentPage}&size=${pageSize}`
                           : `http://localhost:8080/api/news?page=${currentPage}&size=${pageSize}`;

           console.log('Requesting URL:', requestUrl);
           console.log('Current Page:', currentPage);

           if (selectedCategory === '관심 뉴스') {
               if (!isLoggedIn) {
                   setNews([]);
                   setHasMore(false);
                   return;
               }
               const token = localStorage.getItem('token');
               response = await axios.get(requestUrl, {
                   headers: { Authorization: `Bearer ${token}` }
               });
           } else {
               response = await axios.get(requestUrl);
           }

           console.log('API Response:', {
               url: requestUrl,
               status: response.status,
               totalElements: response.data.totalElements,
               totalPages: response.data.totalPages,
               currentPage: response.data.number,
               size: response.data.size,
               content: response.data.content.length
           });

           if (response?.data) {
               if (currentPage === 0) {
                   setNews(response.data.content);
               } else {
                   setNews(prev => {
                       const prevNewsIds = new Set(prev.map(item => item.id));
                       const newContent = response.data.content.filter(item => !prevNewsIds.has(item.id));
                       console.log('Previous news count:', prev.length);
                       console.log('New content count:', newContent.length);
                       return [...prev, ...newContent];
                   });
               }

               const totalElements = response.data.totalElements;
               const currentLoadedCount = (currentPage + 1) * pageSize;
               console.log('Total news available:', totalElements);
               console.log('Currently loaded:', currentLoadedCount);
               
               setHasMore(currentLoadedCount < totalElements);
           }
       } catch (error) {
           console.error('API Error:', error);
       } finally {
           setLoading(false);
       }
   }, [selectedCategory, actualSearchTerm, currentPage, isLoggedIn]);

   useEffect(() => {
       setCurrentPage(0);
       setNews([]);
       if (selectedCategory === '관심 뉴스') {
           setHasMore(true);
       }
       fetchNews();
   }, [selectedCategory, actualSearchTerm]);

   useEffect(() => {
       if (currentPage > 0) {
           fetchNews();
       }
   }, [currentPage, fetchNews]);

   const handleSearch = (e) => {
       e.preventDefault();
       setActualSearchTerm(searchTerm);
       setCurrentPage(0);
   };

   const loadMore = useCallback(() => {
       if (!loading && hasMore) {
           console.log('Loading more... Current page:', currentPage);
           setCurrentPage(prev => {
               console.log('Updating to page:', prev + 1);
               return prev + 1;
           });
       }
   }, [loading, hasMore, currentPage]);

   const handleKeywordClick = (keyword) => {
       setSelectedKeywords(prev => {
           if (prev.includes(keyword)) {
               return prev.filter(k => k !== keyword);
           }
           return [...prev, keyword];
       });
   };

   const filteredNews = news.filter(item => {
       const matchesKeywords = selectedKeywords.length === 0 || 
           selectedKeywords.every(keyword => item.keywords?.includes(keyword));
       return matchesKeywords;
   });

   if (loading && currentPage === 0) {
       return (
           <div className="loading-wrapper">
               <div className="loading-text">뉴스를 불러오는 중...</div>
           </div>
       );
   }

   return (
       <div className="news-wrapper">
           <div className="content-layout">
               <div className="main-section">
                   <div className="search-section">
                       <form onSubmit={handleSearch}>
                           <input
                               type="text"
                               placeholder="제목, 내용, 키워드로 검색..."
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                           />
                           <button type="submit">🔍</button>
                       </form>
                   </div>

                   {selectedKeywords.length > 0 && (
                       <div className="keyword-section">
                           <div className="keyword-list">
                               <span className="keyword-label">선택된 키워드:</span>
                               {selectedKeywords.map(keyword => (
                                   <span key={keyword} className="keyword-tag">
                                       #{keyword}
                                       <button onClick={() => handleKeywordClick(keyword)}>×</button>
                                   </span>
                               ))}
                               <button 
                                   onClick={() => setSelectedKeywords([])} 
                                   className="clear-button"
                               >
                                   모두 지우기
                               </button>
                           </div>
                       </div>
                   )}

                   <div className="news-container">
                       <div className="news-scroll">
                           {selectedCategory === '관심 뉴스' && !isLoggedIn ? (
                               <div className="login-required">
                                   <p>로그인하면 관심 뉴스를 확인할 수 있습니다.</p>
                               </div>
                           ) : (
                               <div className="news-list">
                                   {loading && currentPage === 0 ? (
                                    // 카테고리 변경 시 이전 데이터 표시
                                    prevNews.map((item) => (
                                        <NewsCard 
                                            key={item.id} 
                                            news={item}
                                            onKeywordClick={handleKeywordClick}
                                            style={{ opacity: 0.5 }}
                                        />
                                    ))
                                ) : (
                                    filteredNews.map((item) => (
                                        <NewsCard 
                                            key={item.id} 
                                            news={item}
                                            onKeywordClick={handleKeywordClick}
                                            refreshNews={() => {
                                                if (selectedCategory === '관심 뉴스') {
                                                    setTimeout(() => {
                                                        setCurrentPage(0);
                                                        setNews([]);
                                                        fetchNews();
                                                    }, 100);
                                                }
                                            }}
                                        />
                                    ))
                                )}
                                {filteredNews.length === 0 && !loading && (
                                    <div className="no-results">
                                        검색 결과가 없습니다.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                       
                       {hasMore && (
                           <div className="load-more">
                               <button
                                   onClick={loadMore}
                                   disabled={loading}
                                   className={loading ? 'loading' : ''}
                               >
                                   {loading ? '로딩 중...' : '더 보기'}
                               </button>
                           </div>
                       )}
                   </div>
               </div>

               <div className="category-section">
                   <div className="category-wrapper">
                       <h2>카테고리</h2>
                       <ul>
                           {categories.map((category) => (
                               <li key={category}>
                                   <button 
                                       className={selectedCategory === category ? 'active' : ''}
                                       onClick={() => setSelectedCategory(category)}
                                   >
                                       {category}
                                   </button>
                               </li>
                           ))}
                       </ul>
                   </div>
               </div>
           </div>
       </div>
   );
};

export default NewsList;