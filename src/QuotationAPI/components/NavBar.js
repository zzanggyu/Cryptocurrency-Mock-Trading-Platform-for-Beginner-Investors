import React from "react";
import "../../styles/NavBar.css";
import Community from "./community";
import { useLocation } from "react-router-dom"; 
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


const NavBar = () => {

  const openLoginWindow = (e) => {
    e.preventDefault();
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open("/React-Upbit-API-Example/login", "_blank", 
        `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`);
      };
  const openSignUpWindow = (e) => {
    e.preventDefault();
      const width = 600;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
        
      window.open("/React-Upbit-API-Example/SignUp", "_blank", 
        `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`);
      };
  const openMyPageWindow = (e) => {
    e.preventDefault();
      const width = 600;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
            
      window.open("/React-Upbit-API-Example/MyPage", "_blank", 
        `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`);
      };
  const opentradeapp = (e) => {
        e.preventDefault();
          const width = 600;
          const height = 600;
          const left = (window.screen.width - width) / 2;
          const top = (window.screen.height - height) / 2;
                
          window.open("/React-Upbit-API-Example/MyPage", "_blank", 
            `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`);
          };
  const openInvestmentation = (e) => {
            e.preventDefault();
              const width = 600;
              const height = 600;
              const left = (window.screen.width - width) / 2;
              const top = (window.screen.height - height) / 2;
                    
              window.open("/React-Upbit-API-Example/MyPage", "_blank", 
                `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`);
              };
  const openInvestment = (e) => {
    e.preventDefault();
      const width = 600;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
                    
      window.open("/React-Upbit-API-Example/Investment", "_blank", 
        `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`);
          };

    const openCoinInfo = (e) => {
        e.preventDefault();
                            
        window.open("/React-Upbit-API-Example/CoinInfo", "_blank");
                        };
    const handleExchangeClick = (e) => {
      if (window.location.pathname === "/React-Upbit-API-Example/total-example") {
          e.preventDefault();
        }
          
      };

  return (
    <>
      <nav className="navbar">
        <a href="/React-Upbit-API-Example" className="navbar-logo">주가조작단 </a>
        <div className="navbar-menu">
          <a href="/React-Upbit-API-Example/total-example" onClick={handleExchangeClick}>거래소</a>
          <a href="#" onClick={opentradeapp}>내계좌</a>
          <a href="#" onClick={openInvestmentation}>투자내역</a>
          <a href="#" onClick={openCoinInfo}>코인동향</a>
          <a href="#" onClick={openInvestment}>투자관리</a>
          <Link to="/community">커뮤니티</Link>
          </div>
        <div className="navbar-right">
          <a href="#" onClick={openMyPageWindow}>마이페이지</a>
          <a href="#" onClick={openLoginWindow}>로그인</a>
          <a href="#" onClick={openSignUpWindow}>회원가입</a>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
