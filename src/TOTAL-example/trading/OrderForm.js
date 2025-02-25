import { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedCoinState, selectedCoinInfoState } from '../atom';
import './/OrderForm.css';

export default function OrderForm({ type = 'buy', account, onSubmit }) {
  const selectedCoin = useRecoilValue(selectedCoinState);
  const [userModifiedPrice, setUserModifiedPrice] = useState(false);
  const selectedCoinInfo = useRecoilValue(selectedCoinInfoState);
  const [orderType, setOrderType] = useState('LIMIT');
  const [formData, setFormData] = useState({

    orderPrice: '',
    orderQuantity: '',
    orderAmount: '',
    price: ''  // 추가
  });
  const [activeInput, setActiveInput] = useState(null);

  // 선택된 코인이 변경될 때마다 가격 정보 업데이트
  // 선택된 코인이 변경될 때마다 가격 정보 업데이트
  useEffect(() => {
    if (selectedCoinInfo) {  // selectedCoinInfo가 있을 때만 실행
      setFormData(prev => ({
        ...prev,
        orderPrice: userModifiedPrice ? prev.orderPrice : selectedCoinInfo.trade_price?.toString() || '0',
        orderQuantity: prev.orderQuantity || '', 
        orderAmount: prev.orderAmount || ''
      }));
    }
  }, [selectedCoinInfo, selectedCoin, userModifiedPrice]);
  
  
  
  


// 새로운 코인 선택시 userModifiedPrice 초기화
useEffect(() => {
  setUserModifiedPrice(false);
}, [selectedCoin]);

  // 주문 수량과 가격을 기반으로 주문 총액을 계산
  const calculateOrderAmount = useCallback(() => {
    const price = orderType === 'MARKET' ? selectedCoinInfo?.trade_price : parseFloat(formData.orderPrice);
    const quantity = parseFloat(formData.orderQuantity);
  
    if (price && quantity) {
      const amount = price * quantity;
      // 소수점 없이 정수로만 계산
      const roundedAmount = Math.floor(amount);
      
      setFormData(prev => ({
        ...prev,
        orderAmount: roundedAmount.toLocaleString(),
        price: price // 가격 정보도 저장
      }));
    }
  }, [orderType, selectedCoinInfo, formData.orderPrice, formData.orderQuantity]);

  const handleAmountChange = (e) => {
    setActiveInput('amount');
  
    let newAmount = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력 가능
  
    if (newAmount === '') {
      setFormData((prevData) => ({
        ...prevData,
        orderAmount: '',
        orderQuantity: '' // 주문 금액이 비워지면 주문 수량도 비움
      }));
      return;
    }
  
    newAmount = parseInt(newAmount, 10);
  
    setFormData((prevData) => {
      if (!prevData.price) return { ...prevData, orderAmount: newAmount };
      
      return {
        ...prevData,
        orderAmount: newAmount,
        orderQuantity: (newAmount / prevData.price).toFixed(8) // 주문 수량 계산
      };
    });
  };
  

  const handleQuantityChange = (e) => {
    setActiveInput('quantity');
  
    let newQuantity = e.target.value.replace(/[^0-9.]/g, ''); // 소수점 허용
  
    if (newQuantity === '') {
      setFormData((prevData) => ({
        ...prevData,
        orderQuantity: '',
        orderAmount: '' // 주문 수량이 비워지면 주문 금액도 비움
      }));
      return;
    }
  
    newQuantity = parseFloat(newQuantity);
  
    setFormData((prevData) => {
      if (!prevData.price) return { ...prevData, orderQuantity: newQuantity };
  
      return {
        ...prevData,
        orderQuantity: newQuantity,
        orderAmount: Math.floor(newQuantity * prevData.price).toLocaleString() // 주문 금액 계산
      };
    });
  };
  

  const handleBlur = () => {
    setActiveInput(null);
  };
  

  

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!account) {
    alert('계좌 정보가 필요합니다.');
    return;
  }
  
  if (!selectedCoin[0]) {
    alert('코인을 선택해주세요.');
    return;
  }

  // 문자열에서 콤마 제거하고 숫자로 변환
  const cleanAmount = typeof formData.orderAmount === 'string' 
    ? parseFloat(formData.orderAmount.replace(/,/g, '')) 
    : formData.orderAmount;

    const orderData = orderType === 'MARKET' 
  ? {
      "accountId": account.id,
      "coinSymbol": selectedCoin[0]?.market?.split('-')[1] || '',
      "price": selectedCoinInfo.trade_price,
      "quantity": parseFloat(formData.orderQuantity) || 0,
      "type": type.toUpperCase(),
      "marketPrice": true,
      "amount": cleanAmount || 0
    }
  : {
      "accountId": account.id,
      "coinSymbol": selectedCoin[0]?.market?.split('-')[1] || '',
      "targetPrice": parseFloat(formData.orderPrice) || 0,  // 지정가 주문일 때는 targetPrice 필요
      "quantity": parseFloat(formData.orderQuantity) || 0,
      "type": type.toUpperCase(),
      "marketPrice": false
    };
    
  console.log('전송할 주문 데이터:', orderData);
  onSubmit(orderData);
};

  const setPercentage = (percent) => {
    if (!account || !selectedCoinInfo?.trade_price) return;
  
    if (type === 'buy') {
      const available = account.balance;
      const amount = (available * percent) / 100;
      const quantity = amount / (orderType === 'MARKET' ? selectedCoinInfo.trade_price : parseFloat(formData.orderPrice));
  
      setFormData(prev => ({
        ...prev,
        orderQuantity: quantity.toFixed(8),
        orderAmount: amount
      }));


      calculateOrderAmount();
    } else {
      const holding = account.holdings?.find(h => h.coinSymbol === selectedCoin[0].market.split('-')[1]);
      if (holding) {
        const quantity = (holding.totalQuantity * percent) / 100;
        const price = orderType === 'MARKET' ? selectedCoinInfo.trade_price : parseFloat(formData.orderPrice);
        const amount = quantity * price;
  
        setFormData(prev => ({
          ...prev,
          orderQuantity: quantity.toFixed(8),
          orderAmount: amount
        }));
        calculateOrderAmount();
      }
    }
  };

  return (
    <div className="order-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="input-label">주문유형</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="LIMIT"
                checked={orderType === 'LIMIT'}
                onChange={(e) => setOrderType(e.target.value)}
                className="radio-input"
              />
              지정가
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="MARKET"
                checked={orderType === 'MARKET'}
                onChange={(e) => setOrderType(e.target.value)}
                className="radio-input"
              />
              시장가
            </label>
          </div>
        </div>

        {selectedCoin[0] && (
          <div className="form-group">
            <label className="input-label">선택된 코인</label>
            <div className="selected-coin-info">
              {selectedCoin[0].korean_name} ({selectedCoin[0].market})
            </div>
          </div>
        )}

        {selectedCoinInfo && (
          <div className="form-group">
            <label className="input-label">현재가</label>
            <input
              type="text"
              value={`${selectedCoinInfo?.trade_price?.toLocaleString() || 0} KRW`}
              readOnly
              className="text-input readonly-input"
            />
          </div>
        )}

        {orderType === 'LIMIT' && (
          <div className="form-group">
            <label className="input-label">주문가격 (KRW)</label>
           
              <input
                type="number"
                value={formData.orderPrice}
                onChange={(e) => {
                  setUserModifiedPrice(true);
                  setFormData({ ...formData, orderPrice: e.target.value });
                }}
                className="text-input"
              />
          </div>
        )}

        <div className="form-group">
          <label className="input-label">주문수량</label>
          <input
            type="number"
            value={formData.orderQuantity}
            onChange={handleQuantityChange}
            className="text-input"
            onBlur={handleBlur}
          />
          <div className="percentage-buttons">
            <button type="button" onClick={() => setPercentage(25)} className="percentage-button">25%</button>
            <button type="button" onClick={() => setPercentage(50)} className="percentage-button">50%</button>
            <button type="button" onClick={() => setPercentage(75)} className="percentage-button">75%</button>
            <button type="button" onClick={() => setPercentage(100)} className="percentage-button">100%</button>
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">주문금액</label>
          <input
            type="text"
            inputMode="numeric"
            value={formData.orderAmount}
            onChange={handleAmountChange}
            className="text-input"
            onBlur={handleBlur}
          />
        </div>

        <button
          type="submit"
          className={`submit-button ${type === 'buy' ? 'buy-button' : 'sell-button'}`}
        >
          {type === 'buy' ? '매수' : '매도'}
        </button>
      </form>
    </div>
  );
}