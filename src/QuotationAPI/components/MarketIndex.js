import React, { useState, useEffect } from 'react';
import './styles/MarketIndex.css';
import { getTicker } from '../services/UpbitApi';

function MarketIndex() {
    const [marketData, setMarketData] = useState({ topCoins: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTicker('KRW-BTC');
    
                const coins = data.map(coin => ({
                    name: getCoinName(coin.market),
                    price: coin.trade_price ? coin.trade_price.toLocaleString() : '데이터 없음',
                    changeRate: coin.change_rate ? (coin.change_rate * 100).toFixed(2) : '0.00',
                    change: coin.change || 'NONE'
                }));
    
                setMarketData({ topCoins: coins });
            } catch (error) {
                console.error('시세 조회 실패:', error);
            }
        };
    
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);
    

    return (
        <div className="market-index-container">
            <div className="coin-list-wrapper">
                <h2>실시간 시세</h2>
                <div className="coin-list">
                    {marketData.topCoins.map((coin, index) => (
                        <div key={index} className="coin-item">
                            <span className="coin-name">{coin.name}</span>
                            <span className="coin-price">{coin.price} KRW</span>
                            <span className={`coin-change ${coin.change === 'RISE' ? 'up' : 'down'}`}>
                                {coin.change === 'RISE' ? '+' : '-'}{Math.abs(coin.changeRate)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const getCoinName = (market) => {
    const names = {
        'KRW-BTC': '비트코인',
        'KRW-ETH': '이더리움',
        'KRW-XRP': '리플',
        'KRW-SOL': '솔라나',
        'KRW-TRX': '트론'
    };
    return names[market] || market;  // 기본적으로 마켓 이름 반환
};


export default MarketIndex;
