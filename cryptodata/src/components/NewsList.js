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
   const [page, setPage] = useState(0);
   const [hasMore, setHasMore] = useState(true);
   const isLoggedIn = !!localStorage.getItem('token');

   const categories = [
       '전체 뉴스', '관심 뉴스', 'Digital Asset', 'Market', 'Finance',
       'Policy', 'Research', 'Stories For U', '이슈', '테크', '비즈니스',
       '피플', '분석과 전망', 'Press', 'Chain&Coin', 'Block TV'
   ];

   const fetchNews = useCallback(async () => {
    try {
        setLoading(true);
        let response;

        if (selectedCategory === '관심 뉴스') {
            if (!isLoggedIn) {
                setNews([]);
                setHasMore(false);
                return;
            }
            const token = localStorage.getItem('token');
            let url;
            const params = new URLSearchParams({ page: page, size: 10 });
            
            if (actualSearchTerm) {
                url = `http://localhost:8080/api/news/favorites/search`;
                params.append('keyword', actualSearchTerm);
            } else {
                url = `http://localhost:8080/api/news/favorites`;
            }
            
            response = await axios.get(
                `${url}?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } else if (selectedCategory !== '전체 뉴스' && actualSearchTerm) {
            response = await axios.get(
                `http://localhost:8080/api/news/search?category=${encodeURIComponent(selectedCategory)}&keyword=${encodeURIComponent(actualSearchTerm)}&page=${page}&size=10`
            );
        } else if (selectedCategory !== '전체 뉴스') {
            response = await axios.get(
                `http://localhost:8080/api/news/search?category=${encodeURIComponent(selectedCategory)}&page=${page}&size=10`
            );
        } else if (actualSearchTerm) {
            response = await axios.get(
                `http://localhost:8080/api/news/search?keyword=${encodeURIComponent(actualSearchTerm)}&page=${page}&size=10`
            );
        } else {
            response = await axios.get(
                `http://localhost:8080/api/news?page=${page}&size=10`
            );
        }

        if (response?.data) {
            if (page === 0) {
                setNews(response.data.content);
            } else {
                setNews(prev => [...prev, ...response.data.content]);
            }
            setHasMore(!response.data.last && response.data.content.length > 0);
        }
    } catch (error) {
        console.error('뉴스를 불러오는데 실패했습니다:', error);
    } finally {
        setLoading(false);
    }
}, [selectedCategory, actualSearchTerm, page, isLoggedIn]);

   useEffect(() => {
       setPage(0);
       setNews([]);
       if (selectedCategory === '관심 뉴스') {
           setHasMore(true);
       }
       fetchNews();
   }, [selectedCategory, actualSearchTerm, fetchNews]);

   useEffect(() => {
       if (page > 0) {
           fetchNews();
       }
   }, [page, fetchNews]);

   const handleSearch = (e) => {
       e.preventDefault();
       setActualSearchTerm(searchTerm);
       setPage(0);
   };

   const loadMore = () => {
       if (!loading && hasMore) {
           setPage(prev => prev + 1);
       }
   };

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

   if (loading && page === 0) {
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
                                {filteredNews.map((item) => (
                                    <NewsCard 
                                        key={item.id} 
                                        news={item} 
                                        onKeywordClick={handleKeywordClick}
                                        refreshNews={() => {
                                            if (selectedCategory === '관심 뉴스') {
                                                setTimeout(() => {
                                                    setPage(0);
                                                    setNews([]);
                                                    fetchNews();
                                                }, 100);
                                            }
                                        }}
                                    />
                                ))}
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