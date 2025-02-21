import { useState, useEffect, useCallback } from 'react';
import '../styles/OrderForm.css';

/**
 * 주문 폼 컴포넌트
 * 매수/매도 주문을 위한 입력 폼을 제공합니다.
 * 
 * @param {string} type - 주문 유형 ('buy' 또는 'sell')
 * @param {object} account - 현재 선택된 계좌 정보
 * @param {function} onSubmit - 주문 제출 시 호출될 콜백 함수
 */
export default function OrderForm({ type = 'buy', account, onSubmit }) {
  // 상태 관리
  const [orderType, setOrderType] = useState('LIMIT');  // 'LIMIT' 또는 'MARKET'
  const [formData, setFormData] = useState({
    coinSymbol: '',        // 선택된 코인 심볼
    orderPrice: '',        // 주문 가격
    orderQuantity: '',     // 주문 수량
    orderAmount: ''        // 주문 총액
  });
  const [currentPrice, setCurrentPrice] = useState(null);  // 현재가
  const [marketCodes, setMarketCodes] = useState([]);     // 마켓 코드 목록
  

  // 선택된 코인의 현재가를 업데이트합니다.
  useEffect(() => {
    const fetchMarketCodes = async () => {
      try {
        const response = await fetch('https://api.upbit.com/v1/market/all');
        const data = await response.json();
        // console.log('마켓 코드 조회 결과:', data);  // 데이터 확인용 로그
        setMarketCodes(data);
      } catch (error) {
        console.error('마켓 코드 조회 실패:', error);
      }
    };

    fetchMarketCodes();
  }, []);  // 컴포넌트 마운트 시 한 번만 실행
  
  // OrderForm.js
  useEffect(() => {
    // 현재가가 변경될 때 주문가격 자동 설정
    if (currentPrice) {
      setFormData(prev => ({
        ...prev,
        orderPrice: currentPrice
      }));
    }
  }, [currentPrice]);

  // 마켓 코드 조회 및 실시간 가격 업데이트 시작
  useEffect(() => {
    let intervalId;
    
    const fetchPrice = async () => {
      if (!formData.coinSymbol) return;
      
      try {
        const response = await fetch(`https://api.upbit.com/v1/ticker?markets=${formData.coinSymbol}`);
        const data = await response.json();
        
        if (data[0]) {
          setCurrentPrice(data[0].trade_price);
          if (orderType === 'MARKET') {
            setFormData(prev => ({
              ...prev,
              orderPrice: data[0].trade_price
            }));
          }
        }
      } catch (error) {
        console.error('현재가 조회 실패:', error);
      }
    };

    fetchPrice();  // 즉시 한 번 실행
    intervalId = setInterval(fetchPrice, 1000);  // 1초마다 실행
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [formData.coinSymbol, orderType]);


  // 주문 수량과 가격을 기반으로 주문 총액을 계산합니다.
  const calculateOrderAmount = useCallback(() => {
    const price = orderType === 'MARKET' ? currentPrice : parseFloat(formData.orderPrice);
    const quantity = parseFloat(formData.orderQuantity);
    
    if (price && quantity) {
      const amount = price * quantity;
      setFormData(prev => ({
        ...prev,
        orderAmount: amount
      }));
    }
  }, [orderType, currentPrice, formData.orderPrice, formData.orderQuantity]);
  
  // 수량 입력 시 자동 금액 계산
  useEffect(() => {
    if (formData.orderQuantity) {
      calculateOrderAmount();
    }
  }, [formData.orderQuantity, calculateOrderAmount]);

  // 주문금액 입력 핸들러 추가
  const [activeInput, setActiveInput] = useState(null); // 현재 입력 중인 필드 (amount 또는 quantity)

  const handleAmountChange = (e) => {
    const newQuantity = parseFloat(e.target.value) || 0;
    setFormData((prevData) => {
        // 주문금액 계산 시 소수점을 버리고 정수로 만듬
        const newAmount = Math.round(newQuantity * parseFloat(prevData.orderPrice) || 0);
        return {
            ...prevData,
            orderQuantity: newQuantity,
            orderAmount: `≒ ${newAmount.toLocaleString()}`  // 천 단위 쉼표 추가
        };
    });
};



  const handleBlur = () => {
    // 입력이 완료되면 주문 수량 계산
    const price = orderType === 'MARKET' ? currentPrice : parseFloat(formData.orderPrice);
    const newAmount = parseFloat(formData.orderAmount);
  
    if (price && newAmount) {
      setFormData(prev => ({
        ...prev,
        orderQuantity: (newAmount / price).toFixed(1)
      }));
    }
  };

const handleQuantityChange = (e) => {
  setActiveInput('quantity'); // 주문수량 입력 중임을 설정
  const inputValue = e.target.value;

  if (inputValue === '' || isNaN(inputValue)) {
    setFormData(prev => ({
      ...prev,
      orderQuantity: '',
      orderAmount: ''
    }));
    return;
  }

  const newQuantity = parseFloat(inputValue);
  const price = orderType === 'MARKET' ? currentPrice : parseFloat(formData.orderPrice);

  if (price && newQuantity) {
    setFormData(prev => ({
      ...prev,
      orderQuantity: newQuantity.toString(),
      orderAmount: Math.floor(newQuantity * price).toString()
    }));
  }
};

// 입력이 끝났을 때 (Blur 이벤트) activeInput 초기화
// const handleBlur = () => {
//   setActiveInput(null);
// };


  // 주문 폼 제출을 처리합니다.
  // OrderForm.js의 handleSubmit 함수 수정
// OrderForm.js의 handleSubmit 수정
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!account) {
    alert('계좌를 선택해주세요.');
    return;
  }
  
  if (!formData.coinSymbol) {
    alert('코인을 선택해주세요.');
    return;
  }

  // 지정가 주문 데이터 구조 수정
  const orderData = {
    accountId: account.id,
    coinSymbol: formData.coinSymbol.split('-')[1],
    targetPrice: parseFloat(formData.orderPrice),  // 지정가 주문시 필요
    quantity: parseFloat(formData.orderQuantity),
    type: type.toUpperCase()
  };

  console.log('전송할 주문 데이터:', orderData);
  onSubmit(orderData);
};
  const formatPrice = useCallback((price) => {
    if (!price) return '';
    return parseFloat(price).toLocaleString() + ' KRW';
  }, []);

  // 주문 수량을 계좌 잔고 또는 보유 수량의 일정 비율로 설정합니다.
  const setPercentage = (percent) => {
    if (!account || !currentPrice) return;
  
    if (type === 'buy') {
      const available = account.balance;
      const amount = (available * percent) / 100;
      const quantity = amount / (orderType === 'MARKET' ? currentPrice : parseFloat(formData.orderPrice));
  
      setFormData(prev => ({
        ...prev,
        orderQuantity: quantity.toFixed(8),
        orderAmount: amount
      }));
      calculateOrderAmount();  // 주문금액 업데이트
    } else {
      // 매도 시 보유 수량 기준 계산
      const holding = account.holdings?.find(h => h.coinSymbol === formData.coinSymbol.split('-')[1]);
      if (holding) {
        const quantity = (holding.totalQuantity * percent) / 100;
        const price = orderType === 'MARKET' ? currentPrice : parseFloat(formData.orderPrice);
        const amount = quantity * price;
  
        setFormData(prev => ({
          ...prev,
          orderQuantity: quantity.toFixed(8),
          orderAmount: amount
        }));
        calculateOrderAmount();  // 주문금액 업데이트
      }
    }
  };

  // 코인 목록 드롭다운 업데이트


  // 코인 선택 시 주문량 자동 계산 추가
  const handleCoinSelect = (e) => {
    const newCoinSymbol = e.target.value;
    setFormData(prev => ({
      ...prev,
      coinSymbol: newCoinSymbol,
      orderQuantity: '',
      orderAmount: '',
      orderPrice: currentPrice || ''  // 현재가를 주문가격으로 설정
    }));
  };

  // JSX 렌더링
  return (
    <div className="order-form-container">
      <form onSubmit={handleSubmit}>
        {/* 주문 유형 선택 */}
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

        {/* 코인 선택 */}
        <div className="form-group">
          <label className="input-label">코인 선택</label>
          {console.log('Account data:', account)}
          <select
            id="coinSymbol"
            value={formData.coinSymbol}
            onChange={handleCoinSelect}
            className="text-input"
          >
            <option value="">코인을 선택하세요</option>
            {marketCodes
              .filter(m => {
                //console.log('Checking market:', m.market);  // 각 마켓 확인
                if (type === 'sell') {
                  // console.log('Holdings:', account?.holdings);  // holdings 데이터 확인
                  return m.market.startsWith('KRW-') && 
                        account?.holdings?.some(holding => {
                          // console.log('Comparing:', holding?.coinSymbol, m.market.split('-')[1]);  // 비교 데이터 확인
                          return holding?.coinSymbol === m.market.split('-')[1] && 
                                  holding?.totalQuantity > 0;
                        });
                }
                return m.market.startsWith('KRW-');
              })
              .map(market => (
                <option key={market.market} value={market.market}>
                  {market.korean_name} ({market.market})
                  {type === 'sell' && account?.holdings?.map(holding => {
                    if (holding.coinSymbol === market.market.split('-')[1]) {
                      return ` - 보유: ${holding.totalQuantity.toFixed(8)}`;
                    }
                    return '';
                  })}
                </option>
              ))}
          </select>
        </div>

        {/* 현재가 표시 */}
        {currentPrice && (
          <div className="form-group">
            <label className="input-label">현재가</label>
            <input
              type="text"
              value={`${currentPrice.toLocaleString()} KRW`}
              readOnly
              className="text-input readonly-input"
            />
          </div>
        )}

        {/* 지정가 주문 시 가격 입력 */}
        {orderType === 'LIMIT' && (
          <div className="form-group">
            <label className="input-label">주문가격 (KRW)</label>
            <input
              type="number"
              value={formData.orderPrice}
              onChange={(e) => setFormData({ ...formData, orderPrice: e.target.value })}
              className="text-input"
            />
          </div>
        )}

        {/* 주문 수량 입력 */}
        <div className="form-group">
          <label className="input-label">주문수량</label>
          <input
            type="number"
            value={formData.orderQuantity}
            onChange={handleQuantityChange}
            className="text-input"
            onBlur={handleBlur} // onBlur 시 주문 수량 계산
          />
          <div className="percentage-buttons">
            <button type="button" onClick={() => setPercentage(25)} className="percentage-button">25%</button>
            <button type="button" onClick={() => setPercentage(50)} className="percentage-button">50%</button>
            <button type="button" onClick={() => setPercentage(75)} className="percentage-button">75%</button>
            <button type="button" onClick={() => setPercentage(100)} className="percentage-button">100%</button>
          </div>
        </div>


        {/* 주문 금액 입력 */}
        <div className="form-group">
          <label className="input-label">주문금액</label>
          <input
            type="text"  // number에서 text로 변경
            inputMode="numeric"  
            value={formData.orderAmount}
            onChange={handleAmountChange}
            className="text-input"
            onBlur={handleBlur} // onBlur 시 주문 수량 계산
          />
        </div>

        {/* 주문 버튼 */}
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
