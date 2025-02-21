import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './Investment.css';


/* 기간별 수익률 추가 예정 */







export default function Investment() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [accountInfo, setAccountInfo] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [periodProfits, setPeriodProfits] = useState(null);
  const safeToFixed = (value) => (value !== undefined && value !== null ? value.toFixed(2) : 'N/A');
  // 기간별 수익률 조회 함수 추가
  const loadPeriodProfits = useCallback(async () => {
    if (!selectedAccount) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/transactions/account/${selectedAccount}/profits?period=${selectedPeriod}`
      );
      const data = await response.json();
      setPeriodProfits(data);
    } catch (error) {
      console.error('기간별 수익률 조회 실패:', error);
    }
  }, [selectedAccount, selectedPeriod]);

  // 실시간 데이터 업데이트 함수
  const updateRealTimeData = useCallback(async () => {
    if (!selectedAccount) return;

    try {
      const [accountResponse, holdingsResponse, marketsResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/accounts/${selectedAccount}`),
        fetch(`http://localhost:8080/api/transactions/account/${selectedAccount}/summary`),
        fetch('http://localhost:8080/api/upbit/markets')
      ]);

      const accountData = await accountResponse.json();
      const holdingsData = await holdingsResponse.json();
      const marketsData = await marketsResponse.json();

      setAccountInfo(accountData);
      setPortfolio(holdingsData);
      setMarkets(marketsData);
    } catch (error) {
      console.error('데이터 업데이트 실패:', error);
    }
  }, [selectedAccount]);

  // 계좌 목록 로드
  const loadAccounts = useCallback(async () => {
    try {
      const userId = "testuser"; // 이 부분 수정해야됨 로그인 부분이랑 연결!! 현재 하드코딩
      const response = await fetch(`http://localhost:8080/api/accounts/user/${userId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        setAccounts([]);
        console.error('계좌 데이터가 배열 형식이 아닙니다.');
      }
    } catch (error) {
      console.error('계좌 목록 로드 실패:', error);
      setAccounts([]);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (selectedAccount) {
      loadPeriodProfits();
    }
  }, [selectedAccount, selectedPeriod, loadPeriodProfits]);

  // 실시간 데이터 업데이트 - loadPeriodProfits 제거
  useEffect(() => {
    if (selectedAccount) {
      updateRealTimeData();
      const interval = setInterval(updateRealTimeData, 5000);
      return () => interval && clearInterval(interval);
    }
  }, [selectedAccount, updateRealTimeData]);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];


  return (
    <div className="investment-container">
      <div className="investment-content">
        {/* 계좌 선택 섹션 */}
        <div className="account-select-card">
          <h2 className="account-select-title">계좌 선택</h2>
          <select
            className="account-select"
            onChange={(e) => setSelectedAccount(e.target.value)}
            value={selectedAccount || ''}
          >
            <option value="">계좌를 선택하세요</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} ({account.balance.toLocaleString()} KRW)
              </option>
            ))}
          </select>
        </div>

        {selectedAccount && accountInfo && (
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