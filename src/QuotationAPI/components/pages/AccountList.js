import React, { useState, useEffect } from 'react';
import '../styles/AccountList.css';

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [transactionHistories, setTransactionHistories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [visibleHistories, setVisibleHistories] = useState({}); // 거래내역 표시 상태 관리

  useEffect(() => {
    getAccountsByUserId();
  }, []);

  // 계좌 정보 가져온 후 각 계좌의 거래내역도 자동으로 가져오기
  useEffect(() => {
    accounts.forEach(account => {
      getTransactionHistory(account.id);
      setVisibleHistories(prev => ({...prev, [account.id]: true})); // 기본적으로 모든 거래내역 표시
    });
  }, [accounts]);

  const getAccountsByUserId = async () => {
    setIsLoading(true);
    try {
      const sessionResponse = await fetch('http://localhost:8080/api/check-session', {
        credentials: 'include'
      });
      
      if (!sessionResponse.ok) {
        throw new Error('로그인이 필요합니다.');
      }

      const userInfo = await sessionResponse.json();
      
      const accountResponse = await fetch(`http://localhost:8080/api/accounts/user/${userInfo.username}`, {
        credentials: 'include'
      });

      if (!accountResponse.ok) {
        throw new Error(`HTTP error! status: ${accountResponse.status}`);
      }

      const data = await accountResponse.json();
      
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.error('받은 데이터가 배열이 아닙니다:', data);
        setAccounts([]);
      }
    } catch (error) {
      console.error('계좌 조회 중 오류:', error);
      alert('계좌 조회 중 오류가 발생했습니다: ' + error.message);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionHistory = async (accountId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/transactions/account/${accountId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setTransactionHistories(prev => ({
        ...prev,
        [accountId]: data
      }));
    } catch (error) {
      console.error('거래내역 조회 실패:', error);
      alert('거래내역 조회 중 오류가 발생했습니다.');
    }
  };

  const toggleTransactionHistory = (accountId) => {
    setVisibleHistories(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const getRiskLevelText = (riskLevel) => {
    const riskLevelMap = {
      'CONSERVATIVE': '보수적',
      'MODERATELY_CONSERVATIVE': '약간 보수적',
      'MODERATE': '보통',
      'MODERATELY_AGGRESSIVE': '약간 공격적',
      'AGGRESSIVE': '공격적'
    };
    return riskLevelMap[riskLevel] || riskLevel;
  };

  const getRiskPercentage = (riskLevel) => {
    const percentages = {
      'CONSERVATIVE': 10,
      'MODERATELY_CONSERVATIVE': 15,
      'MODERATE': 20,
      'MODERATELY_AGGRESSIVE': 25,
      'AGGRESSIVE': 30
    };
    return percentages[riskLevel] || 0;
  };

  return (
    <div className="account-list-container">
      <div className="account-list-content">
        <div className="search-section">
          <h2>내 계좌 목록</h2>
        </div>

        <div className="account-list">
          {isLoading ? (
            <div className="loading-message">계좌 정보를 불러오는 중...</div>
          ) : !Array.isArray(accounts) || accounts.length === 0 ? (
            <div className="no-accounts">
              조회된 계좌가 없습니다.
            </div>
          ) : (
            accounts.map(account => (
              <div key={account.id} className="account-card">
                <div className="account-header">
                  <span className="account-number">계좌번호: {account.accountNumber}</span>
                  <button 
                    className="transaction-button"
                    onClick={() => toggleTransactionHistory(account.id)}
                  >
                    {visibleHistories[account.id] ? '거래내역 숨기기' : '거래내역 보기'}
                  </button>
                </div>

                <div className="investment-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">잔액</div>
                      <div className="info-value">{account.balance.toLocaleString()} 원</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">투자 한도</div>
                      <div className="info-value">{account.investmentLimit.toLocaleString()} 원</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">투자 비율</div>
                      <div className="info-value">{getRiskPercentage(account.riskLevel)}%</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">위험 수준</div>
                      <div className="info-value">{getRiskLevelText(account.riskLevel)}</div>
                    </div>
                  </div>
                </div>

                {/* 거래내역 표시 영역 */}
                {visibleHistories[account.id] && transactionHistories[account.id] && (
                  <div className="transaction-history">
                    <h3>거래내역</h3>
                    <div className="transaction-list">
                      {transactionHistories[account.id].map(transaction => (
                        <div key={transaction.id} className="transaction-item">
                          <span>{transaction.transactionDateTime}</span>
                          <span>{transaction.type === 'BUY' ? '매수' : '매도'}</span>
                          <span>{transaction.coinSymbol}</span>
                          <span>{transaction.quantity} 개</span>
                          <span>{transaction.price.toLocaleString()} 원</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}