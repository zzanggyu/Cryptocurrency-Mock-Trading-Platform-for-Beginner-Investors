import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MarketIndex.css';

function MarketIndex() {
    const [marketData, setMarketData] = useState({
        topCoins: []
    });
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/market/ticker', {
                    withCredentials: true
                });

                const coins = response.data.map(coin => ({
                    name: getCoinName(coin.market),
                    price: coin.trade_price.toLocaleString(),
                    changeRate: (coin.change_rate * 100).toFixed(2),
                    change: coin.change,
                    volume: coin.acc_trade_volume_24h.toFixed(2),
                    value: coin.acc_trade_price_24h.toLocaleString()
                }));

                setMarketData({ topCoins: coins });
            } catch (error) {
                console.error('시세 조회 실패:', error);
            }
        };

        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/market/news', {
                    withCredentials: true
                });
                console.log('뉴스 응답:', response.data);
                setNewsData(response.data);
            } catch (error) {
                console.error('뉴스 조회 실패:', error);
            }
        };

        fetchData();
        fetchNews();
        
        const tickerInterval = setInterval(fetchData, 5000);  // 5초마다 시세 갱신
        const newsInterval = setInterval(fetchNews, 60000);   // 1분마다 뉴스 갱신

        return () => {
            clearInterval(tickerInterval);
            clearInterval(newsInterval);
        };
    }, []);

    const getCoinName = (market) => {
        const names = {
            'KRW-BTC': '비트코인',
            'KRW-ETH': '이더리움', 
            'KRW-XRP': '리플',
            'KRW-SOL': '솔라나',
            'KRW-TRX': '트론'
        };
        return names[market] || market;
    };

    return (
        <div className="market-index-container">
            <div className="coin-list-wrapper">
                <h2>실시간 시세</h2>
                <table className="coin-list">
                    <thead>
                        <tr>
                            <th>코인명</th>
                            <th>현재가(KRW)</th>
                            <th>변동률</th>
                            <th>24시간 거래량</th>
                            <th>24시간 거래대금</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketData.topCoins.map((coin, index) => (
                            <tr key={index} className="coin-item">
                                <td className="coin-name">{coin.name}</td>
                                <td className="coin-price">{coin.price} 원</td>
                                <td className={`coin-change ${coin.change === 'RISE' ? 'up' : 'down'}`}>
                                    {coin.change === 'RISE' ? '+' : '-'}{Math.abs(coin.changeRate)}%
                                </td>
                                <td className="coin-volume">{coin.volume}</td>
                                <td className="coin-value">{coin.value} 원</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="news-wrapper">
                <h2>실시간 뉴스</h2>
                <div className="news-list">
                    {newsData.map((news) => (
                        <div key={news.id} className="news-item">
                            <a href={news.url} target="_blank" rel="noopener noreferrer">
                                <img src={news.imageUrl} alt={news.title} className="news-thumbnail" />
                                {news.title}
                            </a>
                            <span className="news-date">
                                {new Date(news.publishDate).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MarketIndex;
