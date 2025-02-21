import React, { useState } from 'react';
import './CreateAccount.css';


export default function CreateAccount() {
  const [formData, setFormData] = useState({
    userId: '', // 로그인 부분이랑 연결해야함
    initialBalance: '',
    riskLevel: 'CONSERVATIVE' // 재호 거랑 연결 해야함
  });

  const [estimatedInvestment, setEstimatedInvestment] = useState({
    amount: 0,
    percentage: 10
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'initialBalance' || name === 'riskLevel') {
      updateEstimatedInvestment(
        name === 'initialBalance' ? value : formData.initialBalance,
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
    
    if (Number(formData.initialBalance) < 100000) {
      alert('초기 예치금은 100,000원 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          initialBalance: Number(formData.initialBalance),
          riskLevel: formData.riskLevel
        })
      });

      if (!response.ok) {
        throw new Error('계좌 생성에 실패했습니다.');
      }

      alert('계좌가 성공적으로 생성되었습니다!');
      window.location.href = '/accounts';
    } catch (error) {
      alert('계좌 생성 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-wrapper">
        <div className="create-account-card">
          <h1 className="create-account-title">새 계좌 생성</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">사용자 ID</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                pattern="^[a-zA-Z0-9]+$"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">초기 예치금</label>
              <input
                type="number"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleInputChange}
                min="100000"
                step="1000"
                className="form-input"
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
                required
              >
                <option value="CONSERVATIVE">보수적 (투자한도: 잔액의 10%)</option>
                <option value="MODERATELY_CONSERVATIVE">약간 보수적 (투자한도: 잔액의 15%)</option>
                <option value="MODERATE">보통 (투자한도: 잔액의 20%)</option>
                <option value="MODERATELY_AGGRESSIVE">약간 공격적 (투자한도: 잔액의 25%)</option>
                <option value="AGGRESSIVE">공격적 (투자한도: 잔액의 30%)</option>
              </select>
            </div>

            {formData.initialBalance && (
              <div className="investment-info">
                <p className="info-text">
                  예상 투자한도: <span className="info-value">{estimatedInvestment.amount.toLocaleString()} 원</span>
                </p>
                <p className="info-text">
                  투자 비율: <span className="info-value">{estimatedInvestment.percentage}%</span>
                </p>
              </div>
            )}

            <button type="submit" className="submit-button">
              계좌 생성
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}