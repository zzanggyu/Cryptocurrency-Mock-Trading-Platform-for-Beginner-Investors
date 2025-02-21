import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AccountList from './pages/AccountList';
import './styles/Trade_App.css';
import NavBar from './NavBar';

function App() {
  return (
      <>
          <div>
              <NavBar />

      {/* 라우트 설정 */}
      <Routes>
        <Route path="/" element={<AccountList />} />
      </Routes>
      
    </div>
    </>
  );
}

export default App;
