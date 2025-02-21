import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { selectedCoinState } from "./atom"; // Recoil 상태 불러오기

const PanelContainer = styled.div`
  width: 350px;
  height: 300px;
  margin-top: 460px;
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

const CoinList = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const CoinItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
 
`;

const OrderPanel = () => {
  const [selectedCoin] = useRecoilState(selectedCoinState);

  return (
    <PanelContainer>
      <Header>
        <HeaderButton active>관심코인</HeaderButton>
        <HeaderButton>보유</HeaderButton>
      </Header>
      <CoinList>
        {selectedCoin.length > 0 ? (
          selectedCoin.map((coin) => (
            <CoinItem key={coin.market}>{coin.market}</CoinItem>
          ))
        ) : (
          <p>관심 코인이 없습니다.</p>
        )}
      </CoinList>
    </PanelContainer>
  );
};

export default OrderPanel;
