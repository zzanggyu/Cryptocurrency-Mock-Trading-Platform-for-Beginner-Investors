// src/pages/Trading.js

import OrderForm from './trading/OrderForm.js';
import PendingOrders from './trading/PendingOrders.js';
import TransactionHistory from './trading/TransactionHistory.js';
import React, { useState, useEffect, useCallback } from 'react';
import './Trading.css';

/**
 * 거래소 메인 페이지 컴포넌트
 * 계좌 선택, 주문하기, 주문 내역, 거래 내역 등 모든 거래 관련 기능을 포함합니다.
 */
export default function Trading() {
  // 상태 관리
  const [currentTab, setCurrentTab] = useState('buy');  // 현재 선택된 탭
  const [selectedAccount, setSelectedAccount] = useState(null);  // 선택된 계좌
  const [accounts, setAccounts] = useState([]);  // 계좌 목록
  const [accountInfo, setAccountInfo] = useState(null);  // 계좌 상세 
  

    /**
   * 선택된 계좌의 상세 정보를 업데이트합니다.
   */
    const updateAccountInfo = useCallback(async () => {
      if (!selectedAccount) return;
    
      try {
        // 계좌 기본 정보 가져오기
        const accountResponse = await fetch(`http://localhost:8080/api/accounts/${selectedAccount}`);
        const accountData = await accountResponse.json();
    
        // 보유 코인 정보 가져오기
        const holdingsResponse = await fetch(`http://localhost:8080/api/transactions/account/${selectedAccount}/summary`);
        const holdingsData = await holdingsResponse.json();
    
        // 계좌 정보와 보유 코인 정보 합치기
        setAccountInfo({
          ...accountData,
          holdings: holdingsData
        });
    
        console.log('업데이트된 계좌 정보:', {
          ...accountData,
          holdings: holdingsData
        });
      } catch (error) {
        console.error('계좌 정보 업데이트 실패:', error);
      }
    }, [selectedAccount]);

  // 컴포넌트 마운트 시 계좌 목록 로드
  useEffect(() => {
    loadAccounts();
  }, []);

  // 계좌 선택 시 계좌 정보 업데이트
  useEffect(() => {
    if (selectedAccount) {
      updateAccountInfo();
    }
  }, [selectedAccount, updateAccountInfo]); 

  useEffect(() => {
    if (accountInfo) {
      console.log('계정 정보 변경됨:', accountInfo);
      console.log('보유 코인 정보:', accountInfo.holdings);
    }
  }, [accountInfo]);

  /**
   * 사용자의 계좌 목록을 불러옵니다.
   */
  const loadAccounts = async () => {
    try {
      const userId = "testuser"; // 실제 구현시 로그인된 사용자 ID 사용
      const response = await fetch(`http://localhost:8080/api/accounts/user/${userId}`);
      const data = await response.json();
      console.log("API 응답 데이터:", data); // 응답 확인
  
      // 데이터가 배열인지 확인하고, 아니면 빈 배열 할당
      setAccounts(Array.isArray(data) ? data : Array.isArray(data.accounts) ? data.accounts : []);
    } catch (error) {
      console.error('계좌 목록 로드 실패:', error);
      alert('계좌 목록을 불러오는데 실패했습니다.');
    }
  };
  



  /**
   * 주문 제출을 처리합니다.
   * @param {Object} orderData - 주문 데이터
   */
  // Trading.js의 handleOrderSubmit 함수
// Trading.js
// Trading.js의 handleOrderSubmit 함수 수정
// Trading.js의 handleOrderSubmit 함수 수정
// Trading.js
const handleOrderSubmit = async (orderData) => {
  try {
    console.log('서버로 전송되는 주문 데이터:', orderData);

    const endpoint = orderData.marketPrice 
      ? 'http://localhost:8080/api/transactions'
      : 'http://localhost:8080/api/limit-orders';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    console.log('서버 응답:', data);

    // Trading.js의 handleOrderSubmit 함수 수정
    if (response.status === 409) {
      const confirmForce = window.confirm(data.message + '\n계속 진행하시겠습니까?');
      if (confirmForce) {
        // 강제 매수용 데이터 구성
        const forceOrderData = {
          accountId: orderData.accountId,
          coinSymbol: orderData.coinSymbol,
          price: orderData.price,  // orderData에서 직접 price 사용
          quantity: orderData.quantity,
          type: 'BUY',
          marketPrice: orderData.marketPrice || false,
          amount: orderData.amount 
        };
    
        console.log('강제 매수 요청 데이터:', forceOrderData);
    
        const forceResponse = await fetch('http://localhost:8080/api/transactions/force', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(forceOrderData)
        });

    if (!forceResponse.ok) {
      const errorData = await forceResponse.json();
      throw new Error(errorData.message || '강제 매수 처리에 실패했습니다.');
    }

    const forceData = await forceResponse.json();
    console.log('강제 매수 응답:', forceData);
    
    alert('강제 매수가 성공적으로 처리되었습니다.');
    updateAccountInfo();
    return forceData;
  }
  return;
}

    if (!response.ok) {
      throw new Error(data.message || '주문 처리에 실패했습니다.');
    }

    alert('주문이 성공적으로 처리되었습니다.');
    updateAccountInfo();
    return data;

  } catch (error) {
    console.error('주문 처리 실패:', error);
    alert(error.message || '주문 처리 중 오류가 발생했습니다.');
    throw error;
  }
};


  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 계좌 선택 섹션 */}
        <div className="account-card">
          <div className="form-group">
            <label className="form-label">계좌 선택</label>
            <select
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="form-select"
            >
              <option value="">계좌를 선택하세요</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} ({account.balance.toLocaleString()} KRW)
                </option>
              ))}
            </select>
          </div>
  
          {/* 계좌 정보 표시 */}
          {accountInfo && (
            <div className="account-grid">
              <div className="info-box">
                <div className="info-label">보유 KRW</div>
                <div className="info-value">
                  {accountInfo.balance.toLocaleString()} KRW
                </div>
              </div>
              <div className="info-box">
                <div className="info-label">투자한도</div>
                <div className="info-value">
                  {accountInfo.investmentLimit.toLocaleString()} KRW
                </div>
              </div>
              <div className="info-box">
                <div className="info-label">현재 투자금액</div>
                <div className="info-value">
                  {accountInfo.investmentAmount.toLocaleString()} KRW
                </div>
              </div>
            </div>
          )}
        </div>
  
        {/* 탭 메뉴 */}
        <div className="tab-container">
          <button 
            className={`tab ${currentTab === 'buy' ? 'active' : ''}`}
            onClick={() => setCurrentTab('buy')}
          >
            매수
          </button>
          <button 
            className={`tab ${currentTab === 'sell' ? 'active' : ''}`}
            onClick={() => setCurrentTab('sell')}
          >
            매도
          </button>
          <button 
            className={`tab ${currentTab === 'pending' ? 'active' : ''}`}
            onClick={() => setCurrentTab('pending')}
          >
            거래대기
          </button>
          <button 
            className={`tab ${currentTab === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentTab('history')}
          >
            거래내역
          </button>
        </div>
  
        {/* 주문 폼 (매수/매도) */}
        {(currentTab === 'buy' || currentTab === 'sell') && selectedAccount && (
          <OrderForm
            type={currentTab}
            account={accountInfo}
            
            onSubmit={handleOrderSubmit}
          />
        )}
  
        {/* 거래대기 목록 */}
        {currentTab === 'pending' && selectedAccount && (
          <PendingOrders
            accountId={selectedAccount}
            onOrderCancel={updateAccountInfo}
          />
        )}
  
        {/* 거래내역 */}
        {currentTab === 'history' && selectedAccount && (
          <TransactionHistory
            accountId={selectedAccount}
          />
        )}
  
        {/* 계좌 미선택 시 안내 메시지 */}
        {!selectedAccount && (
          <div className="no-account-message">
            <p>계좌를 선택하시면 거래를 시작할 수 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}