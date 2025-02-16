import React, { useState } from 'react';
import Navigation from './components/Navigation';
import NewsList from './components/NewsList';
import CoinInfo from './components/CoinInfo';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('뉴스');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab.toLowerCase() === '뉴스' && (
        <div className="container mx-auto px-4 flex flex-col gap-6">
          {/* 뉴스 리스트 컨테이너 */}
          <div className="news-container">
            <NewsList />
          </div>

          {/* 코인 정보 컨테이너 */}
          <div className="coin-container">
            <CoinInfo />
          </div>
        </div>
      )}
    </div>
  );
}



export default App;