import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '../styles/Investment.css';

export default function Investment() {
  // 값이 undefined나 null일 때의 안전한 처리를 위한 유틸리티 함수
  const safeToFixed = (value) => (value !== undefined && value !== null ? value.toFixed(2) : 'N/A');

  // 상태 관리
  const [accountInfo, setAccountInfo] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [periodProfits, setPeriodProfits] = useState(null);
  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(true);

  // 세션에서 사용자 정보를 가져오는 함수
  const getUserAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      // 세션에서 사용자 정보 가져오기
      const response = await fetch('http://localhost:8080/api/check-session', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('사용자 정보를 불러올 수 없습니다.');
      }
  
      const userData = await response.json();
      
      // 사용자의 계좌 정보 가져오기
      const accountResponse = await fetch(`http://localhost:8080/api/accounts/user/${userData.username}`, {
        credentials: 'include'
      });
      
      if (!accountResponse.ok) {
        throw new Error('계좌 정보를 불러올 수 없습니다.');
      }
  
      const accountData = await accountResponse.json();
      if (accountData && accountData.length > 0) {
        setAccountInfo(accountData[0]);  // 사용자당 계좌는 하나이므로 첫 번째 계좌 사용
        return accountData[0].id;
      } else {
        throw new Error('계좌가 없습니다.');
      }
    } catch (error) {
      console.error('계좌 정보 로드 실패:', error);
      // setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 기간별 수익률 데이터 로드
  const loadPeriodProfits = useCallback(async () => {
    if (!accountInfo) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/transactions/account/${accountInfo.id}/profits?period=${selectedPeriod}`
      );
      if (!response.ok) {
        throw new Error('수익률 데이터를 불러올 수 없습니다.');
      }
      const data = await response.json();
      setPeriodProfits(data);
    } catch (error) {
      console.error('기간별 수익률 조회 실패:', error);
      setPeriodProfits(null);
    }
  }, [accountInfo, selectedPeriod]);

  // 실시간 데이터 업데이트 함수
  const updateRealTimeData = useCallback(async () => {
    if (!accountInfo) return;

    try {
      const [holdingsResponse, marketsResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/transactions/account/${accountInfo.id}/summary`),
        fetch('http://localhost:8080/api/upbit/markets')
      ]);

      const holdingsData = await holdingsResponse.json();
      const marketsData = await marketsResponse.json();

      setPortfolio(holdingsData);
      setMarkets(marketsData);
    } catch (error) {
      console.error('데이터 업데이트 실패:', error);
    }
  }, [accountInfo]);

  // 초기 데이터 로드
  useEffect(() => {
    getUserAccount();
  }, [getUserAccount]);

  // 실시간 데이터 업데이트 설정
  useEffect(() => {
    if (accountInfo) {
      updateRealTimeData();
      const interval = setInterval(updateRealTimeData, 5000);
      return () => clearInterval(interval);
    }
  }, [accountInfo, updateRealTimeData]);

  // 기간별 수익률 데이터 로드 설정
  useEffect(() => {
    if (accountInfo) {
      loadPeriodProfits();
    }
  }, [accountInfo, selectedPeriod, loadPeriodProfits]);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="investment-container">
        <div className="loading-message">데이터를 불러오는 중...</div>
      </div>
    );
  }

  // 계좌 정보가 없을 때 표시할 컴포넌트
  if (!accountInfo) {
    return (
      <div className="investment-container">
        <div className="error-message">계좌 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }


  return (
    <div className="investment-container">
      <div className="investment-content">
        {/* 계좌 정보 섹션 */}
        <div className="account-select-card">
          <h2 className="account-select-title">계좌 정보</h2>
          <div className="account-info">
            <div className="account-number">
              계좌번호: {accountInfo.accountNumber}
            </div>
            <div className="account-balance">
              잔액: {accountInfo.balance.toLocaleString()} KRW
            </div>
          </div>
        </div>
        {accountInfo && (
          <>
            {/* 계좌 요약 정보 */}
            <div className="account-select-card">
              <h2 className="account-select-title">계좌 요약</h2>
              <div className="account-summary">
              <div className="summary-card">
                  <div className="summary-label">보유 KRW</div>
                  <div className="summary-value">
                    {safeToFixed(accountInfo.balance)} KRW  {/* safeToFixed로 감싸기 */}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">총 보유자산</div>
                  <div className="summary-value">
                    {safeToFixed(accountInfo.balance + portfolio.reduce((sum, coin) => sum + coin.currentValue, 0))} KRW  {/* safeToFixed로 감싸기 */}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">투자한도</div>
                  <div className="summary-value">
                    {safeToFixed(accountInfo.investmentLimit)} KRW  {/* safeToFixed로 감싸기 */}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">현재 투자금액</div>
                  <div className="summary-value">
                    {safeToFixed(accountInfo.investmentAmount)} KRW  {/* safeToFixed로 감싸기 */}
                  </div>
                </div>

              </div>
            </div>

            <div className="account-select-card">
              <div className="period-header">
                <h2 className="account-select-title">기간별 수익률</h2>
                <div className="period-selector">
                  <button 
                    className={`period-button ${selectedPeriod === 'daily' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('daily')}
                  >
                    일별
                  </button>
                  <button 
                    className={`period-button ${selectedPeriod === 'weekly' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('weekly')}
                  >
                    주별
                  </button>
                  <button 
                    className={`period-button ${selectedPeriod === 'monthly' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('monthly')}
                  >
                    월별
                  </button>
                </div>
              </div>

              {selectedPeriod && !periodProfits && (
              <div className="loading-message">
                수익률 데이터를 불러오는 중...
              </div>
            )}
              
              {periodProfits && (
                <div className="period-profits">
                  <div className="summary-card">
                    <div className="summary-label">기간 수익률</div>
                    <div className={`summary-value ${periodProfits.totalProfitRate >= 0 ? 'profit' : 'loss'}`}>
                      {periodProfits.totalProfitRate >= 0 ? '+' : ''}
                      {safeToFixed(periodProfits.totalProfitRate)}%  {/* safeToFixed로 감싸기 */}
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-label">기간 손익</div>
                    <div className={`summary-value ${periodProfits.totalProfit >= 0 ? 'profit' : 'loss'}`}>
                      {safeToFixed(periodProfits.totalProfit)} KRW  {/* safeToFixed로 감싸기 */}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* 포트폴리오 차트와 보유 현황 */}
            {portfolio.length > 0 && (
              <div className="chart-section">
                <h2 className="chart-title">투자 현황</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolio}
                        dataKey="currentValue"
                        nameKey="coinSymbol"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ coinSymbol, percent }) => 
                          `${coinSymbol} ${(percent * 100).toFixed(1)}%`
                        }
                      >
                        {portfolio.map((entry, index) => (
                          <Cell 
                            key={entry.coinSymbol}
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => value.toLocaleString() + ' KRW'} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <table className="holdings-table">
                  <thead>
                    <tr>
                      <th>코인명</th>
                      <th>보유수량</th>
                      <th>평균매수가</th>
                      <th>현재가</th>
                      <th>총매수금액</th>
                      <th>평가금액</th>
                      <th>평가손익</th>
                      <th>수익률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map(coin => {
                      const profitLoss = coin.currentValue - coin.totalBuyAmount;
                      const profitLossRate = (profitLoss / coin.totalBuyAmount) * 100;
                      const market = markets.find(m => m.market === `KRW-${coin.coinSymbol}`);
                      return (
                        <tr key={coin.coinSymbol}>
                          <td>
                            <span className="coin-name">
                              {market ? market.korean_name : coin.coinSymbol}
                            </span>
                            <span className="coin-symbol">
                              ({coin.coinSymbol})
                            </span>
                          </td>
                          <td>{safeToFixed(coin.totalQuantity)}</td>  {/* 기존 toFixed 대신 safeToFixed 사용 */}
                          <td>{safeToFixed(coin.avgBuyPrice)}</td>  {/* 기존 toFixed 대신 safeToFixed 사용 */}
                          <td>{safeToFixed(coin.currentPrice)}</td>  {/* 기존 toFixed 대신 safeToFixed 사용 */}
                          <td>{safeToFixed(coin.totalBuyAmount)}</td>  {/* 기존 toFixed 대신 safeToFixed 사용 */}
                          <td>{safeToFixed(coin.currentValue)}</td>  {/* 기존 toFixed 대신 safeToFixed 사용 */}
                          <td className={profitLoss >= 0 ? 'profit' : 'loss'}>
                            {safeToFixed(profitLoss)} {/* profitLoss를 safeToFixed로 감싸기 */}
                          </td>
                          <td className={profitLoss >= 0 ? 'profit' : 'loss'}>
                            {profitLoss >= 0 ? '+' : ''}{safeToFixed(profitLossRate)}% {/* profitLossRate를 safeToFixed로 감싸기 */}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}