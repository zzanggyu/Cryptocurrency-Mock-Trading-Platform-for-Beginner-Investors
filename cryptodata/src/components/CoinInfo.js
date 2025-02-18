import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CoinInfo.css';

const CoinInfo = () => {
    const [allData, setAllData] = useState({
        weeklyTrends: [],
        assetInfo: [],
        marketData: [],
        buyingRank: [],
        sellingRank: []
    });
    const [showAllAssets, setShowAllAssets] = useState(false);
    const [showAllMarket, setShowAllMarket] = useState(false);
    const [activeTab, setActiveTab] = useState('assets');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/all-data');
                setAllData(response.data);
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const displayedAssets = showAllAssets ? allData.assetInfo : allData.assetInfo.slice(0, 10);
    const displayedMarket = showAllMarket ? allData.marketData : allData.marketData.slice(0, 10);

    const getTextColor = (value) => {
        if (value?.startsWith('+')) return 'text-red-500';
        if (value?.startsWith('-')) return 'text-blue-500';
        return 'text-gray-900';
    };

    return (
        <div className="coin-info-container">
            <div className="coin-info-wrapper">
                {/* 왼쪽 주요 정보 영역 */}
                <div className="main-content">
                    {/* 주간 상승률 */}
                    <div className="card weekly-trends">
                        <h2 className="card-title">주간 상승률</h2>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>순위</th>
                                        <th>코인명</th>
                                        <th>변동률</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allData.weeklyTrends.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.title}</td>
                                            <td className={getTextColor(item.changePercent)}>
                                                {item.changePercent}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 탭 메뉴 */}
                    <div className="card digital-assets">
                        <div className="tab-header">
                            <h2 className="card-title">디지털 자산</h2>
                            <div className="tab-buttons">
                                <button
                                    className={`tab-button ${activeTab === 'assets' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('assets')}
                                >
                                    기간별 상승률
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'market' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('market')}
                                >
                                    시가총액
                                </button>
                            </div>
                        </div>

                        {/* 자산 정보 */}
                        {activeTab === 'assets' && (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>자산명</th>
                                            <th>주간</th>
                                            <th>월간</th>
                                            <th>3개월</th>
                                            <th>6개월</th>
                                            <th>연간</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedAssets.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td className={getTextColor(item.weeklyGain)}>{item.weeklyGain}</td>
                                                <td className={getTextColor(item.monthlyGain)}>{item.monthlyGain}</td>
                                                <td className={getTextColor(item.threemonthGain)}>{item.threemonthGain}</td>
                                                <td className={getTextColor(item.sixmonthGain)}>{item.sixmonthGain}</td>
                                                <td className={getTextColor(item.yearlyGain)}>{item.yearlyGain}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {allData.assetInfo.length > 10 && (
                                    <div className="button-wrapper">
                                        <button 
                                            onClick={() => setShowAllAssets(!showAllAssets)} 
                                            className="toggle-button"
                                        >
                                            {showAllAssets ? '접기' : '더보기'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 시가총액 정보 */}
                        {activeTab === 'market' && (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>순위</th>
                                            <th>코인명</th>
                                            <th>시가총액</th>
                                            <th>거래대금</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedMarket.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.rank}</td>
                                                <td>{item.name}</td>
                                                <td>{item.marketcap}</td>
                                                <td>{item.transactionvalue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {allData.marketData.length > 10 && (
                                    <div className="button-wrapper">
                                        <button 
                                            onClick={() => setShowAllMarket(!showAllMarket)} 
                                            className="toggle-button"
                                        >
                                            {showAllMarket ? '접기' : '더보기'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 오른쪽 매수/매도 체결 강도 영역 */}
                <div className="side-content">
                    {/* 매수 체결 강도 */}
                    <div className="card buying-rank">
                        <h2 className="card-title">매수 체결 강도</h2>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>순위</th>
                                        <th>코인명</th>
                                        <th>변동률</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allData.buyingRank.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.title}</td>
                                            <td className={getTextColor(item.changePercent)}>
                                                {item.changePercent}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 매도 체결 강도 */}
                    <div className="card selling-rank">
                        <h2 className="card-title">매도 체결 강도</h2>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>순위</th>
                                        <th>코인명</th>
                                        <th>변동률</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allData.sellingRank.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.title}</td>
                                            <td className={getTextColor(item.changePercent)}>
                                                {item.changePercent}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinInfo;