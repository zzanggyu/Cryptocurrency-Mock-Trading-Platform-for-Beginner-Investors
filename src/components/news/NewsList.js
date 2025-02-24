// NewsList.js

import React, { useState, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';
import axios from 'axios';
import './NewsList.css';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('전체 뉴스');
    const [searchTerm, setSearchTerm] = useState('');
    const [actualSearchTerm, setActualSearchTerm] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const categories = [
        '전체 뉴스', '관심 뉴스', 'Digital Asset', 'Market', 'Finance',
        'Policy', 'Research', 'Stories For U', '이슈', '테크', '비즈니스',
        '피플', '분석과 전망', 'Press', 'Chain&Coin', 'Block TV'
    ];

    const fetchNews = useCallback(async () => {
        try {
            setLoading(true);
            setIsTransitioning(true);
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

            response = await axios.get(requestUrl, { withCredentials: true });

            if (response?.data) {
                if (currentPage === 0) {
                    setNews(prev => {
                        const newData = response.data.content;
                        if (JSON.stringify(prev) === JSON.stringify(newData)) {
                            return prev;
                        }
                        return newData;
                    });
                } else {
                    setNews(prev => {
                        const prevNewsIds = new Set(prev.map(item => item.id));
                        const newContent = response.data.content.filter(item => !prevNewsIds.has(item.id));
                        return [...prev, ...newContent];
                    });
                }

                const totalElements = response.data.totalElements;
                const currentLoadedCount = (currentPage + 1) * pageSize;
                setHasMore(currentLoadedCount < totalElements);
            }
        } catch (error) {
            if (error.response?.status === 401 && selectedCategory === '관심 뉴스') {
                setNews([]);
                setHasMore(false);
            } else {
                console.error('API Error:', error);
            }
        } finally {
            setTimeout(() => {
                setLoading(false);
                setIsTransitioning(false);
            }, 300);
        }
    }, [selectedCategory, actualSearchTerm, currentPage]);

    useEffect(() => {
        setCurrentPage(0);
        fetchNews();
    }, [selectedCategory, actualSearchTerm]);

    useEffect(() => {
        if (currentPage > 0) {
            fetchNews();
        }
    }, [currentPage, fetchNews]);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsTransitioning(true);
        setActualSearchTerm(searchTerm);
        setCurrentPage(0);
    };

    const handleCategoryChange = (category) => {
        if (category === selectedCategory) return;
        setIsTransitioning(true);
        setSelectedCategory(category);
        setCurrentPage(0);
        setActualSearchTerm('');
        setSearchTerm('');
    };

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

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

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/info', {
                withCredentials: true
            });
            setIsLoggedIn(true);
        } catch (error) {
            setIsLoggedIn(false);
        }
    };

    // 컴포넌트 마운트 시 로그인 상태 체크
    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div className="news-wrapper">
            <div className="content-layout">
                <div className="main-section">
                    <div className="search-section">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="제목, 내용, 키워드로 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">🔍</button>
                        </form>
                    </div>

                    {selectedKeywords.length > 0 && (
                        <div className="keyword-section">
                            <div className="keyword-list">
                                <span className="keyword-label">선택된 키워드:</span>
                                {selectedKeywords.map(keyword => (
                                    <span key={keyword} className="keyword-tag">
                                        #{keyword}
                                        <button onClick={() => handleKeywordClick(keyword)} className="keyword-remove">×</button>
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
                            <div className={`news-scroll ${isTransitioning ? 'transitioning' : ''}`}>
                                {selectedCategory === '관심 뉴스' && !isLoggedIn ? (
                                    <div className="login-required">
                                        <p>로그인하면 관심 뉴스를 확인할 수 있습니다.</p>
                                    </div>
                                ) : (
                                    <div className={`news-list ${loading ? 'loading' : ''}`}>
                                        {filteredNews.length === 0 && !loading ? (
                                            <div className="no-results">
                                                {selectedCategory === '관심 뉴스' ? '관심 뉴스가 없습니다.' : '검색 결과가 없습니다.'}
                                            </div>
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
                                                                fetchNews();
                                                            }, 100);
                                                        }
                                                    }}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                        {hasMore && (
                            <div className="load-more">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className={`load-more-button ${loading ? 'loading' : ''}`}
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
                                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(category)}
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