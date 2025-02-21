import React, { useState } from "react";
import styled from "styled-components";

const PanelContainer = styled.div`
  width: 350px;
  height: 300px;
  margin-top: 60px;
  padding: 20px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid #ddd;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-bottom: 2px solid red;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "red" : "black")};
  cursor: pointer;
  padding: 10px;
  &:hover {
    color: red;
  }
`;

const OrderForm = styled.div`
  width: 100%;
  padding: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center; /* 요소를 한 줄에 정렬 */
  gap: 10px; /* 요소 간격 조정 */
  margin-bottom: 15px;

  label {
    font-size: 14px;
    white-space: nowrap; /* 줄바꿈 방지 */
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 5px;
  }

  input {
    width: 100px;
    height: 30px;
    border: none;
    padding: 5px;
    font-size: 18px;
    text-align: right;
    outline: none;
  }

  button {
    width: 30px;
    height: 30px;
    border: none;
    background: #eee;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;




const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    width: 48%;
    padding: 10px;
    border: none;
    background-color: blue;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  button:first-child {
    background-color: red;
  }
`;

const OrderPanel = () => {
  const [price, setPrice] = useState(149924000);

  const increasePrice = () => setPrice(price + 1000);
  const decreasePrice = () => setPrice(price - 1000);

  return (
    <PanelContainer>
      <Header>
        <HeaderButton active>매수</HeaderButton>
        <HeaderButton>매도</HeaderButton>
        <HeaderButton>거래내역</HeaderButton>
      </Header>
      <OrderForm>
        <InputGroup>
            <label>매수가격 (KRW)</label>
            <div className="input-wrapper">
                <input type="text" value="0" readOnly />
                <button>+</button>
                <button>-</button>
            </div>
            </InputGroup>
        <InputGroup>
        <div>
          <label>주문수량 (BTC)</label>
          <input type="number" placeholder="0" />
        </div>
        </InputGroup>
        <InputGroup>
        <div>
          <label>주문총액 (KRW)</label>
          <input type="number" placeholder="0" />
        </div>
        </InputGroup>
        <ButtonGroup>
          <button>매수</button>
          <button>매도</button>
        </ButtonGroup>
      </OrderForm>
    </PanelContainer>
  );
};

export default OrderPanel;
