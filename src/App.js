// App.js 

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RecoilRoot } from 'recoil';
import SignUp from './components/SignUp';
import Login from './components/Login';
import MyPage from './components/MyPage';
import InvestmentSurvey from './components/InvestmentSurvey';
import SessionTimer from './components/SessionTimer';
import MarketIndex from './components/MarketIndex';
import BoardList from './components/community/BoardList';
import BoardWrite from './components/community/BoardWrite';
import BoardDetail from './components/community/BoardDetail';
import NewsList from './components/news/NewsList';
import TotalExample from './TOTAL-example/TotalExample';
import CreateAccount from './QuotationAPI/components/pages/CreateAccount';
import TransactionHistory from './TOTAL-example/trading/TransactionHistory';
import Investment from './QuotationAPI/components/pages/Investmentation';
import AccountList from './QuotationAPI/components/pages/AccountList';
import CoinInfo from '../src/components/news/CoinInfo';

import './App.css';

function App() {
    const [user, setUser] = React.useState(null);
 
    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/info', {
                withCredentials: true
            });
            setUser(response.data);
        } catch (error) {
            setUser(null);
        }
    };
 
    // 초기 세션 체크와 주기적 체크 설정
    useEffect(() => {
        // 초기 세션 체크 
        checkLoginStatus();
 
        // 5분마다 세션 갱신을 위한 체크 (300000ms = 5분)
        const interval = setInterval(checkLoginStatus, 300000);
        
        return () => clearInterval(interval);
    }, []);
 
    // 로그인 성공 시 핸들러
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        // 로그인 후 즉시 세션 상태 체크
        setTimeout(() => {
            console.log("2초 후 세션 체크 실행");
            checkLoginStatus();
        }, 2000);
    };
   
 
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, {
                withCredentials: true
            });
            setUser(null);
            localStorage.removeItem('sessionStart');
            window.location.href = '/';
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };
    
    
    return (
        <RecoilRoot>
            <Router>
                <div className="app">
                    <nav className="nav-bar">
                        <Link to="/" className="nav-logo">
                            주가조작단
                        </Link>
                        <div className="nav-menu">
                            <Link to="/trade" className="menu-item">거래소</Link>
                            <Link to="/createaccount" className="menu-item">계좌생성</Link>
                            <Link to="/invest" className="menu-item">투자내역</Link>
                            <Link to="/trends" className="menu-item">코인동향</Link>
                            <Link to="/investment-survey" className="menu-item">투자관리</Link>
                            <Link to="/accountlist" className="menu-item">계좌내역</Link>
                            <Link to="/boards" className="menu-item">커뮤니티</Link>
                        </div>
                        <div className="nav-links">
                            {user ? (
                                <>
                                    <div className="user-info">
                                        <span className="user-name">{user.nickname}님</span>
                                        <SessionTimer setUser={setUser} />
                                    </div>
                                    <Link to="/mypage" className="nav-link">MY</Link>
                                    <button onClick={handleLogout} className="logout-btn">
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signup" className="nav-link">회원가입</Link>
                                    <Link to="/login" className="nav-link">로그인</Link>
                                </>
                            )}
                        </div>
                    </nav>
                    <Routes>
                    <Route path="/trends" element={
                        <div className="container mx-auto px-4 flex flex-col gap-6">
                            <div className="news-container">
                                <NewsList />
                            </div>
                            <div className="coin-container">
                                <CoinInfo />
                            </div>
                        </div>
                    } />
                </Routes>
                    <Routes>
                        <Route path="/" element={<MarketIndex />} />
                        <Route path="/trade" element={<TotalExample />} />
                        <Route path="/main" element={<MarketIndex />}/>
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={
                       <Login 
                           setUser={setUser} 
                           onLoginSuccess={handleLoginSuccess}
                       />
                   } />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="/investment-survey" element={<InvestmentSurvey />}  />
                        <Route path="/boards" element={<BoardList />} />
                        <Route path="/boards/write" element={<BoardWrite />} />
                        <Route path="/boards/:id" element={<BoardDetail />} />
                        <Route path="/createaccount" element={<CreateAccount /> }/>
                        <Route path="/tran" element={<TransactionHistory />} />
                        <Route path="/invest" element={<Investment />} />
                        <Route path="/accountlist" element={<AccountList />} />
                    </Routes>
                </div>
            </Router>
        </RecoilRoot>
    );
}

export default App;
