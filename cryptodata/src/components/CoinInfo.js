import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
                {/* 주간 상승률 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">주간 상승률</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">순위</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">코인명</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">변동률</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allData.weeklyTrends.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.changePercent)}`}>
                                            {item.changePercent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 탭 메뉴 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between border-b pb-2">
                        <h2 className="text-xl font-bold text-gray-900">디지털 자산</h2>
                        <div className="flex space-x-4">
                            <button
                                className={`px-4 py-2 text-lg font-medium ${
                                    activeTab === 'assets' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                }`}
                                onClick={() => setActiveTab('assets')}
                            >
                                기간별 상승률
                            </button>
                            <button
                                className={`px-4 py-2 text-lg font-medium ${
                                    activeTab === 'market' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                }`}
                                onClick={() => setActiveTab('market')}
                            >
                                시가총액
                            </button>
                        </div>
                    </div>

                    {/* 자산 정보 */}
                    {activeTab === 'assets' && (
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">자산명</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">주간 상승률</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">월간 상승률</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">3개월 상승률</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">6개월 상승률</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">연간 상승률</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayedAssets.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.weeklyGain)}`}>{item.weeklyGain}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.monthlyGain)}`}>{item.monthlyGain}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.threemonthGain)}`}>{item.threemonthGain}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.sixmonthGain)}`}>{item.sixmonthGain}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.yearlyGain)}`}>{item.yearlyGain}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {allData.assetInfo.length > 10 && (
                                <button onClick={() => setShowAllAssets(!showAllAssets)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                                    {showAllAssets ? '접기' : '더보기'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* 시가총액 정보 */}
                    {activeTab === 'market' && (
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">순위</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">코인명</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">시가총액</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">거래대금</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayedMarket.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rank}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.marketcap}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.transactionvalue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 매수/매도 체결 강도 */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">매수 체결 강도</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">순위</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">코인명</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">변동률</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allData.buyingRank.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.changePercent)}`}>
                                                {item.changePercent}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">매도 체결 강도</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">순위</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">코인명</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">변동률</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allData.sellingRank.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${getTextColor(item.changePercent)}`}>
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