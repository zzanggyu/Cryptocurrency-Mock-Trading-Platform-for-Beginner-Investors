// src/components/trading/TransactionHistory.js

import { useState, useEffect, useCallback } from 'react';
import '../styles/TransactionHistory.css';

/**
 * 거래 내역을 표시하는 컴포넌트
 * 계좌의 모든 매수/매도 거래 내역을 시간순으로 보여줍니다.
 * 
 * @param {string} accountId - 거래 내역을 조회할 계좌의 ID
 */
export default function TransactionHistory({ accountId }) {
  // 거래 내역 목록을 저장하는 상태
  const [transactions, setTransactions] = useState([]);
  // 로딩 상태를 관리하는 상태
  const [isLoading, setIsLoading] = useState(false);


 /**
   * 계좌의 거래 내역을 서버에서 가져옵니다.
   * 매수/매도가 체결된 거래들만 포함됩니다.
   */
  const loadTransactions = useCallback(async () => {
    if (!accountId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/transactions/account/${accountId}`);
      if (!response.ok) throw new Error('Failed to load transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('거래내역 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  // 계좌 ID가 변경되거나 컴포넌트가 마운트될 때 거래 내역을 로드
  useEffect(() => {
    if (accountId) {
      loadTransactions();
    }
  }, [accountId, loadTransactions]);


  // 계좌가 선택되지 않은 경우 아무것도 표시하지 않음
  if (!accountId) {
    return null;
  }

  // 로딩 중인 경우 로딩 메시지 표시
  if (isLoading) {
    return (
      <div className="text-center p-4 text-gray-500">
        거래내역을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="history-container">
      <table className="transaction-table">
        <thead className="table-header">
          <tr>
            <th>체결시간</th>
            <th>코인</th>
            <th>종류</th>
            <th className="text-right">체결가격</th>
            <th className="text-right">체결수량</th>
            <th className="text-right">체결금액</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                거래내역이 없습니다.
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => (
              <tr key={tx.id || index} className="table-row">
                <td className="table-cell">
                  {new Date(tx.transactionDateTime).toLocaleString()}
                </td>
                <td className="table-cell">
                  <div className="coin-info">
                    <span className="coin-name">{tx.coinSymbol}</span>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`type-${tx.type.toLowerCase()}`}>
                    {tx.type === 'BUY' ? '매수' : '매도'}
                  </span>
                </td>
                <td className="table-cell text-right">
                  {tx.price.toLocaleString()} KRW
                </td>
                <td className="table-cell text-right">
                  {tx.quantity.toLocaleString()}
                </td>
                <td className="table-cell text-right">
                  {tx.amount.toLocaleString()} KRW
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}