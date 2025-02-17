import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

const Navigation = ({ activeTab, setActiveTab }) => {
    const tabs = ['거래소', '입출금', '투자내역', '코인동향', '서비스+', 'NFT'];
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    // 컴포넌트 마운트 시 로그인 상태 확인
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
        window.location.reload(); // 페이지 새로고침
    };

    const handleLoginSuccess = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
        setIsLoginOpen(false);
    };

    return (
        <nav className="bg-[#c9e3f7]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`py-4 px-3 text-sm font-medium ${
                                    activeTab === tab.toLowerCase() 
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {isLoggedIn ? (
                            <>
                                <span className="text-sm text-gray-700">{username}님</span>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <button 
                                    className="px-4 py-1 text-sm text-gray-700 hover:text-blue-600"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="px-4 py-1 text-sm text-gray-700 hover:text-blue-600" 
                                    onClick={handleLoginClick}
                                >
                                    로그인
                                </button>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <button 
                                    className="px-4 py-1 text-sm text-gray-700 hover:text-blue-600"
                                    onClick={handleSignupClick}
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                        <select className="ml-2 px-2 py-1 text-sm bg-transparent border-none text-gray-700">
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