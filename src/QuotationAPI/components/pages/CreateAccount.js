import React, { useState, useEffect } from 'react';
import '../styles/CreateAccount.css';

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    balance: '',
    riskLevel: ''
  });

  const [estimatedInvestment, setEstimatedInvestment] = useState({
    amount: 0,
    percentage: 10
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialUserData, setInitialUserData] = useState(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/api/user/info', {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login';
            return;
          }
          throw new Error('사용자 정보를 불러오는데 실패했습니다.');
        }

        const userData = await response.json();
        setInitialUserData(userData);
        setFormData({
          balance: '',  // 입력 필드는 빈 값으로 시작
          riskLevel: userData.style || 'CONSERVATIVE'
        });
      } catch (error) {
        setError(error.message);
        console.error('사용자 정보 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'balance' || name === 'riskLevel') {
      updateEstimatedInvestment(
        name === 'balance' ? value : formData.balance,
        name === 'riskLevel' ? value : formData.riskLevel
      );
    }
  };

  const updateEstimatedInvestment = (balance, riskLevel) => {
    const percentage = getRiskPercentage(riskLevel);
    const amount = (Number(balance) * (percentage / 100));
    setEstimatedInvestment({
      amount,
      percentage
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Number(formData.balance) < 100000) {
      setError('초기 예치금은 100,000원 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          initialBalance: Number(formData.balance),
          riskLevel: formData.riskLevel
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '계좌 생성에 실패했습니다.');
      }

      alert('계좌가 성공적으로 생성되었습니다!');
      window.location.href = '/accounts';
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-wrapper">
        <div className="create-account-card">
          <h1 className="create-account-title">새 계좌 생성</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">초기 예치금</label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleInputChange}
                min="100000"
                step="1000"
                className="form-input"
                placeholder={initialUserData ? `회원가입 시 설정값: ${initialUserData.balance}원` : "초기 예치금을 입력하세요"}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">투자성향</label>
              <select
                name="riskLevel"
                value={formData.riskLevel}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
              >
                <option value="CONSERVATIVE">보수적 (투자한도: 잔액의 10%)</option>
                <option value="MODERATELY_CONSERVATIVE">약간 보수적 (15%)</option>
                <option value="MODERATE">보통 (20%)</option>
                <option value="MODERATELY_AGGRESSIVE">약간 공격적 (25%)</option>
                <option value="AGGRESSIVE">공격적 (30%)</option>
              </select>
              {initialUserData && (
                <small className="form-help">
                  회원가입 시 설정된 투자성향: {initialUserData.style}
                </small>
              )}
            </div>

            {formData.balance && (
              <div className="investment-info">
                <p className="info-text">
                  예상 투자한도: 
                  <span className="info-value">
                    {estimatedInvestment.amount.toLocaleString()} 원
                  </span>
                </p>
                <p className="info-text">
                  투자 비율: 
                  <span className="info-value">
                    {estimatedInvestment.percentage}%
                  </span>
                </p>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? '계좌 생성 중...' : '계좌 생성'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}