// src/components/trading/PendingOrders.js

import { useState, useEffect, useCallback } from 'react';
import './PendingOrders.css';

export default function PendingOrders({ accountId, onOrderCancel }) {
  const [orders, setOrders] = useState([]);


    /**
   * 대기 중인 주문 목록을 서버에서 가져옵니다.
   * 주문 상태가 'PENDING'인 주문들만 표시됩니다.
   */
  const loadPendingOrders = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/limit-orders/account/${accountId}`);
      if (!response.ok) throw new Error('Failed to load orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      loadPendingOrders();
      const interval = setInterval(loadPendingOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [accountId, loadPendingOrders]);


  /**
   * 특정 주문을 취소합니다.
   * 사용자 확인 후 서버에 취소 요청을 보냅니다.
   * 
   * @param {string} orderId - 취소할 주문의 ID
   */
  const handleCancel = async (orderId) => {
    // 사용자 확인
    if (!window.confirm('주문을 취소하시겠습니까?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/limit-orders/${orderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to cancel order');
      
      alert('주문이 취소되었습니다.');
      // 주문 목록 새로고침
      loadPendingOrders();
      // 부모 컴포넌트에 취소 알림
      onOrderCancel && onOrderCancel(orderId);
    } catch (error) {
      console.error('주문 취소 실패:', error);
      alert('주문 취소 중 오류가 발생했습니다.');
    }
  };

  // 계좌가 선택되지 않은 경우 아무것도 표시하지 않음
  if (!accountId) {
    return null;
  }

  
  return (
    <div className="table-container">
      <table className="orders-table">
        <thead className="table-header">
          <tr>
            <th>주문시간</th>
            <th>코인</th>
            <th>종류</th>
            <th className="text-right">주문가격</th>
            <th className="text-right">주문수량</th>
            <th className="text-right">주문총액</th>
            <th className="text-center">상태</th>
            <th className="text-center">취소</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty-message">
                대기 중인 주문이 없습니다.
              </td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id} className="table-row">
                <td className="table-cell">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="table-cell">{order.coinSymbol}</td>
                <td className="table-cell">
                  {order.type === 'BUY' ? '매수' : '매도'}
                </td>
                <td className="table-cell text-right">
                  {order.targetPrice.toLocaleString()} KRW
                </td>
                <td className="table-cell text-right">
                  {order.quantity.toLocaleString()}
                </td>
                <td className="table-cell text-right">
                  {(order.targetPrice * order.quantity).toLocaleString()} KRW
                </td>
                <td className="table-cell text-center">
                  <span className={`status-${order.status.toLowerCase()}`}>
                    {order.status === 'PENDING' ? '대기중' : 
                     order.status === 'COMPLETED' ? '체결완료' : '취소됨'}
                  </span>
                </td>
                <td className="table-cell text-center">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="cancel-button"
                    >
                      취소
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}