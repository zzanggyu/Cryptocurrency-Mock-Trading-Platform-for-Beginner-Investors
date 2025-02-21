import React, { useState } from 'react';
import '../styles/AccountList.css';

/* 입금 기능 추가 예정*/






/* 계좌 삭제 기능 추가 예정*/






export default function AccountList() {
  const [userId, setUserId] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [transactionHistories, setTransactionHistories] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getAccountsByUserId = async () => {
    if (!userId) {
      alert('사용자 ID를 입력해주세요.');
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      alert('사용자 ID는 영문자와 숫자만 포함할 수 있습니다.');
      return;
    }

    setIsLoading(true); // 로딩 시작
    try {
      const response = await fetch(`http://localhost:8080/api/accounts/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // 데이터 검증
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.error('받은 데이터가 배열이 아닙니다:', data);
        setAccounts([]);
      }
    } catch (error) {
      console.error('계좌 조회 중 오류:', error);
      alert('계좌 조회 중 오류가 발생했습니다: ' + error.message);
      setAccounts([]); // 오류 발생 시 빈 배열로 초기화
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const getTransactionHistory = async (accountId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/transactions/account/${accountId}`);
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
          <h2>계좌 조회</h2>
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="사용자 ID를 입력하세요"
              pattern="^[a-zA-Z0-9]+$"
            />
            <button 
              onClick={getAccountsByUserId} 
              className="search-button"
              disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            >
              {isLoading ? '조회 중...' : '조회'}
            </button>
          </div>
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
                  <button className="transaction-button" onClick={() => getTransactionHistory(account.id)}>
                    거래내역
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}