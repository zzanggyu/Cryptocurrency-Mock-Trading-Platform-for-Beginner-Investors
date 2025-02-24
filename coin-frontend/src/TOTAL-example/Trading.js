import React, { useState, useEffect, useCallback } from 'react';
import OrderForm from './trading/OrderForm.js';
import PendingOrders from './trading/PendingOrders.js';
import TransactionHistory from './trading/TransactionHistory.js';
import './Trading.css';
import { useRecoilValue } from "recoil";
import { marketCodesState, selectedCoinInfoState, selectedCoinState } from "./atom";


export default function Trading() {
  const [currentTab, setCurrentTab] = useState('buy');
  const [accountInfo, setAccountInfo] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const selectedCoin = useRecoilValue(selectedCoinState);
  const selectedCoinInfo = useRecoilValue(selectedCoinInfoState);

  const updateAccountInfo = useCallback(async () => {
    if (!accountId) return;
  
    try {
      const accountResponse = await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
        credentials: 'include'
      });
      const accountData = await accountResponse.json();
  
      const holdingsResponse = await fetch(`http://localhost:8080/api/transactions/account/${accountId}/summary`, {
        credentials: 'include'
      });
      const holdingsData = await holdingsResponse.json();
  
      setAccountInfo({
        ...accountData,
        holdings: holdingsData
      });
    } catch (error) {
      console.error('계좌 정보 업데이트 실패:', error);
    }
  }, [accountId]);

  // 초기 로드 시 사용자의 계좌 정보 가져오기
  const loadUserAccount = async () => {
    try {
      const sessionResponse = await fetch('http://localhost:8080/api/check-session', {
        credentials: 'include'
      });

      if (!sessionResponse.ok) {
        throw new Error('로그인이 필요합니다.');
      }

      const userInfo = await sessionResponse.json();

      const accountsResponse = await fetch(`http://localhost:8080/api/accounts/user/${userInfo.username}`, {
        credentials: 'include'
      });

      if (!accountsResponse.ok) {
        throw new Error('계좌 정보를 불러오는데 실패했습니다.');
      }

      const accounts = await accountsResponse.json();
      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccountId(accounts[0].id); // 첫 번째 계좌 선택
      } else {
        throw new Error('사용 가능한 계좌가 없습니다.');
      }
    } catch (error) {
      console.error('계좌 정보 로드 실패:', error);
      alert(error.message);
    }
  };

  useEffect(() => {
    loadUserAccount();
  }, []);

  useEffect(() => {
    if (accountId) {
      updateAccountInfo();
    }
  }, [accountId, updateAccountInfo]);

  const handleOrderSubmit = async (orderData) => {
    try {
      const endpoint = orderData.marketPrice 
        ? 'http://localhost:8080/api/transactions'
        : 'http://localhost:8080/api/limit-orders';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.status === 409) {
        const confirmForce = window.confirm(data.message + '\n계속 진행하시겠습니까?');
        if (confirmForce) {
          const forceOrderData = {
            accountId: orderData.accountId,
            coinSymbol: orderData.coinSymbol,
            price: orderData.price,
            quantity: orderData.quantity,
            type: 'BUY',
            marketPrice: orderData.marketPrice || false,
            amount: orderData.amount 
          };
      
          const forceResponse = await fetch('http://localhost:8080/api/transactions/force', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(forceOrderData)
          });

          if (!forceResponse.ok) {
            const errorData = await forceResponse.json();
            throw new Error(errorData.message || '강제 매수 처리에 실패했습니다.');
          }

          const forceData = await forceResponse.json();
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
        {/* 계좌 정보 표시 */}
        {accountInfo && (
          <div className="account-card">
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
          </div>
        )}

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
        {(currentTab === 'buy' || currentTab === 'sell') && accountInfo && (
          <OrderForm
            type={currentTab}
            account={accountInfo}
            onSubmit={handleOrderSubmit}
            selectedCoin={selectedCoin[0]}  // 선택된 코인 정보 전달
            currentPrice={selectedCoinInfo?.trade_price} // 현재가 전달
          />
        )}

        {/* 거래대기 목록 */}
        {currentTab === 'pending' && accountId && (
          <PendingOrders
            accountId={accountId}
            onOrderCancel={updateAccountInfo}
          />
        )}

        {/* 거래내역 */}
        {currentTab === 'history' && accountId && (
          <TransactionHistory
            accountId={accountId}
          />
        )}

        {/* 계좌 정보 로딩 중이거나 없을 때 메시지 */}
        {!accountInfo && (
          <div className="no-account-message">
            <p>계좌 정보를 불러오는 중입니다...</p>
          </div>
        )}
      </div>
    </div>
  );
}