import React, { useState } from 'react';
import NewsList from './NewsList';
import CoinInfo from './CoinInfo';
import '../styles/Coin_App.css';
import NavBar from '../NavBar';

function App() {
  const [activeTab, setActiveTab] = useState('코인동향');

  return (
    <div className="min-h-screen bg-gray-50">
                <NavBar />
      {activeTab.toLowerCase() === '코인동향' && (
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