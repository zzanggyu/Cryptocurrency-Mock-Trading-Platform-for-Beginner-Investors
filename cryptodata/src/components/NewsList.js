import React, { useState, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';
import axios from 'axios';

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
       '전체 뉴스',
       '관심 뉴스',
       'Digital Asset',
       'Market',
       'Finance',
       'Policy',
       'Research',
       'Stories For U',
       '이슈',
       '테크',
       '비즈니스',
       '피플',
       '분석과 전망',
       'Press',
       'Chain&Coin',
       'Block TV'
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
                // 관심 뉴스 검색용 새 엔드포인트 사용
                url = `http://localhost:8080/api/news/favorites/search`;
                params.append('keyword', actualSearchTerm);
            } else {
                // 기존 관심 뉴스 조회
                url = `http://localhost:8080/api/news/favorites`;
            }
            
            response = await axios.get(
                `${url}?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log('관심 뉴스 응답:', response.data);
        } else if (selectedCategory !== '전체 뉴스' && actualSearchTerm) {
            // 카테고리 내 검색
            response = await axios.get(
                `http://localhost:8080/api/news/search?category=${encodeURIComponent(selectedCategory)}&keyword=${encodeURIComponent(actualSearchTerm)}&page=${page}&size=10`
            );
        } else if (selectedCategory !== '전체 뉴스') {
            // 카테고리만 검색
            response = await axios.get(
                `http://localhost:8080/api/news/search?category=${encodeURIComponent(selectedCategory)}&page=${page}&size=10`
            );
        } else if (actualSearchTerm) {
            // 전체 검색
            response = await axios.get(
                `http://localhost:8080/api/news/search?keyword=${encodeURIComponent(actualSearchTerm)}&page=${page}&size=10`
            );
        } else {
            // 전체 뉴스
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
}, [selectedCategory, actualSearchTerm,  page, isLoggedIn]);
   // 카테고리나 검색어 변경시 초기화 및 데이터 가져오기
   useEffect(() => {
       setPage(0);
       setNews([]);
       if (selectedCategory === '관심 뉴스') {
           setHasMore(true);  // 관심 뉴스로 전환시 hasMore 초기화
       }
       fetchNews();
   }, [selectedCategory, actualSearchTerm, fetchNews]);

   // 페이지 변경시 데이터 가져오기
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
           } else {
               return [...prev, keyword];
           }
       });
   };

   const filteredNews = news.filter(item => {
       const matchesKeywords = selectedKeywords.length === 0 || 
           selectedKeywords.every(keyword => item.keywords?.includes(keyword));
       return matchesKeywords;
   });

   if (loading && page === 0) {
       return (
           <div className="flex justify-center items-center h-64">
               <div className="text-gray-500">뉴스를 불러오는 중...</div>
           </div>
       );
   }

   return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex gap-8">
       

        {/* 메인 컨텐츠 */}
        <div className="flex-grow">
            

            {/* 검색 바 */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="제목, 내용, 키워드로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        🔍
                    </button>
                </form>
            </div>

            {/* 키워드 필터 */}
            {selectedKeywords.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">선택된 키워드:</span>
                        {selectedKeywords.map(keyword => (
                            <span key={keyword} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-2">
                                #{keyword}
                                <button onClick={() => setSelectedKeywords(prev => prev.filter(k => k !== keyword))} className="hover:text-blue-800">×</button>
                            </span>
                        ))}
                        <button onClick={() => setSelectedKeywords([])} className="text-sm text-gray-500 hover:text-gray-700">모두 지우기</button>
                    </div>
                </div>
            )}

            {/* 뉴스 컨테이너 */}
            <div className="bg-white rounded-lg shadow">
                <div className="h-[calc(100vh-0.8rem)] overflow-y-auto">
                    {selectedCategory === '관심 뉴스' && !isLoggedIn ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <p className="text-gray-500 mb-4">로그인하면 관심 뉴스를 확인할 수 있습니다.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
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
                                <div className="p-6 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {hasMore && (
                    <div className="p-4 text-center border-t">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            {loading ? '로딩 중...' : '더 보기'}
                        </button>
                    </div>
                )}
                       </div>
                   
               </div>

               {/* 카테고리 컨테이너 */}
               <div className="w-64 flex-shrink-0">
                   <div className="bg-white rounded-lg shadow p-4">
                       <h2 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">카테고리</h2>
                       <ul className="space-y-2">
                           {categories.map((category) => (
                               <li key={category}>
                                   <button 
                                       className={`w-full text-left py-2 px-3 rounded 
                                           ${selectedCategory === category 
                                               ? 'bg-blue-100 text-blue-600' 
                                               : 'hover:bg-gray-100 text-gray-700'
                                           }`}
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