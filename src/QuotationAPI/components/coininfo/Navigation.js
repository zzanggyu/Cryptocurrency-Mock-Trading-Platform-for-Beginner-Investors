import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import '../styles/Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
    const tabs = ['거래소', '입출금', '투자내역', '코인동향', '서비스+', 'NFT'];
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username');
        if (token && savedUsername) {
            setIsLoggedIn(true);
            setUsername(savedUsername);
        }
    }, []);

    const handleLoginClick = () => {
        setIsSignupMode(false);
        setIsLoginOpen(true);
    };

    const handleSignupClick = () => {
        setIsSignupMode(true);
        setIsLoginOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        window.location.reload();
    };

    const handleLoginSuccess = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
        setIsLoginOpen(false);
    };

    return (
        <nav className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-content">
                    <div className="tab-list">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`tab-button ${
                                    activeTab === tab.toLowerCase() ? 'active' : ''
                                }`}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="user-section">
                        {isLoggedIn ? (
                            <>
                                <span className="username">{username}님</span>
                                <div className="divider"></div>
                                <button 
                                    className="auth-button"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="auth-button"
                                    onClick={handleLoginClick}
                                >
                                    로그인
                                </button>
                                <div className="divider"></div>
                                <button 
                                    className="auth-button"
                                    onClick={handleSignupClick}
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                        <select className="language-select">
                            <option value="ko">한국어</option>
                            <option value="en">EN</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)}
                initialIsSignup={isSignupMode}
                onLoginSuccess={handleLoginSuccess}
            />
        </nav>
    );
};

export default Navigation;