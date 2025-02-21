import React, { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import './NewsCard.css';

const NewsCard = ({ news, onKeywordClick, refreshNews }) => {
    const [isFavorite, setIsFavorite] = useState(news.favorited || false);

    const handleClick = () => {
        window.open(news.url, '_blank');
    };

    const handleKeywordClick = (keyword) => {
        onKeywordClick(keyword);
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        try {
            const response = await axios.post(
                `http://localhost:8080/api/news/${news.id}/favorite`,
                null,
                { withCredentials: true }
            );
            
            if (response.status === 200) {
                setIsFavorite(response.data.isFavorite);
                if (refreshNews) {
                    refreshNews();
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
            } else {
                console.error('관심 뉴스 설정 실패:', error);
                alert('관심 뉴스 설정에 실패했습니다.');
            }
        }
    };

    const displayedKeywords = news.keywords?.slice(0, 5);
    const remainingCount = news.keywords?.length - 5;

    return (
        <div className="news-card">
            <div className="news-card-content" onClick={handleClick}>
                <div className="news-card-image">
                    <img
                        src={news.imageUrl || '/api/placeholder/200/200'}
                        alt={news.title}
                        className="news-image"
                    />
                </div>
                <div className="news-card-details">
                    <svg
                        onClick={handleFavoriteClick}
                        className="favorite-icon"
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

                    <div className="news-meta">
                        {news.categories?.map((category, index) => (
                            <React.Fragment key={category}>
                                <span className="category">{category}</span>
                                {index < news.categories.length - 1 && (
                                    <span className="separator">•</span>
                                )}
                            </React.Fragment>
                        ))}
                        <span className="separator">•</span>
                        <span className="publish-date">
                            {format(new Date(news.publishDate), 'yyyy-MM-dd HH:mm')}
                        </span>
                    </div>
                    <h2 className="news-title">{news.title}</h2>
                    <p className="news-content">{news.content}</p>
                </div>
            </div>

            <div className="news-keywords">
                <div className="author-tag">
                    {news.author}
                </div>
                <div className="keywords-list">
                    {displayedKeywords?.map((keyword, index) => (
                        <span
                            key={index}
                            className="keyword"
                            onClick={() => handleKeywordClick(keyword)}
                        >
                            #{keyword}
                        </span>
                    ))}
                    {remainingCount > 0 && (
                        <span className="remaining-keywords">
                            +{remainingCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsCard;