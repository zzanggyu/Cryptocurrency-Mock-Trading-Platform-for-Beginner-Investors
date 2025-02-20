import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsList from './components/NewsList';
import CoinInfo from './components/CoinInfo';
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

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, {
                withCredentials: true
            });
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <Router>
            <div className="app">
                <nav className="nav-bar">
                    <Link to="/" className="nav-logo">
                        주가조작단
                    </Link>
                    <div className="nav-menu">
                        <Link to="/" className="menu-item">거래소</Link>
                        <Link to="/" className="menu-item">입출금</Link>
                        <Link to="/" className="menu-item">투자내역</Link>
                        <Link to="/trends" className="menu-item">코인동향</Link>
                        <Link to="/" className="menu-item">투자관리</Link>
                        <Link to="/" className="menu-item">고객센터</Link>
                        <Link to="/" className="menu-item">커뮤니티</Link>
                    </div>
                    <div className="nav-links">
                        {user ? (
                            <>
                                <div className="user-info">
                                    <span className="user-name">{user.nickname}님</span>
                                </div>
                                <Link to="/" className="nav-link">MY</Link>
                                <button onClick={handleLogout} className="logout-btn">
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="nav-link">회원가입</Link>
                                <Link to="/" className="nav-link">로그인</Link>
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
                    <Route path="/" element={<div>메인 페이지</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;