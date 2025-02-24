import { memo, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { useWsTicker } from "use-upbit-api";
import { marketCodesState, selectedCoinInfoState, selectedCoinState, userState } from "./atom";
import axios from 'axios';

const convertMillonWon = (value) => value / 1000000;

const CoinListBox = styled.div`
  height: 800px;
  margin: 5px;
  width: 400px;
  background-color: white;
  overflow: overlay;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  font-family: Arial, sans-serif;
`;

const CoinBoxHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 1px;
  background-color: white;
  opacity: 0.8;
  height: 55px;
  display: flex;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.3fr;
  border-bottom: 0.5px solid lightgrey;
  font-size: 14px;
  font-weight: 600;
  font-family: Arial, sans-serif;
  border-top : 1px solid #ccc;
  div , button{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const CoinBox = styled.div`
  height: 45px;
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.3fr;
  border-bottom: 0.5px solid lightgrey;
  font-size: 14px;
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
  font-family: Arial, sans-serif;
  :hover {
    background-color: lightgrey;
  }
  div {
    display: flex;
  }
  div:nth-child(2) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  div:nth-child(3) {
    justify-content: flex-end;
    align-items: center;
  }
  div:nth-child(4) {
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
  div:nth-child(5) {
    justify-content: flex-end;
    align-items: center;
  }
`;

const CoinBoxName = styled.div`
  font-weight: 600;
  font-size: 11px;

  div:nth-child(1) {
    color: black;
    font-weight: 600;
    font-size: 14px;
  }
  
  div:nth-child(2) {
    color: gray;
    font-weight: 400;
    font-size: 10px;
  }
`;


const CoinBoxPrice = styled.div`
  font-weight: 600;
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: ${(props) => (props.changeType === "RISE" ? "#EF1C1C" : props.changeType === "FALL" ? "#1261C4" : "#000")};
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  font-family: Arial, sans-serif;
  color: ${(props) => (props.selected ? "gold" : "gray")};
  cursor: pointer;
   :hover {
    background-color: ;
  }
`;

const FavoriteButton = styled.button`
  width: 50%;
  margin: 5px;
  color:black;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-family: Arial, sans-serif;
  font-weight: 600;
   :hover {
    background-color: lightgrey;
  }
`;

const CoinBoxChange = styled.div`
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: ${(props) => (props.changeType === "RISE" ? "#EF1C1C" : props.changeType === "FALL" ? "#1261C4" : "#000")};
`;

const CoinSelector = () => {
  const marketCodes = useRecoilValue(marketCodesState);
  const [selectedCoin, setSelectedCoin] = useRecoilState(selectedCoinState);
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { socketData } = useWsTicker(marketCodes);
  const [selectedCoinInfo, setSelectedCoinInfo] = useRecoilState(selectedCoinInfoState);
  const [user] = useRecoilState(userState);

  // 즐겨찾기 목록 불러오기
  const loadFavorites = async () => {
      try {
          const response = await axios.get('http://localhost:8080/api/favorites', {
              withCredentials: true
          });
          setFavoriteCoins(response.data.map(fav => fav.symbol));
      } catch (error) {
          if (error.response?.status !== 401) {
              console.error('즐겨찾기 목록 조회 실패:', error);
          }
      }
  };
	
	useEffect(() => {
	    if (user) {
	      loadFavorites();
	    } else {
	      setFavoriteCoins([]);
	    }
	  }, [user]);
  const checkLoginStatus = async () => {
	try {
	        const response = await axios.get('http://localhost:8080/api/user/info', {
	          withCredentials: true
	        });
	        if (response.data) {
	          loadFavorites();  // 로그인 되어있으면 즐겨찾기 목록 로드
	        } else {
	          setFavoriteCoins([]);  // 로그아웃 상태면 즐겨찾기 목록 초기화
	        }
	      } catch (error) {
	        setFavoriteCoins([]);  // 에러 발생 시 즐겨찾기 목록 초기화
	      }
  };
  useEffect(() => {
    if (socketData) {
      const targetData = socketData.find((data) => data.code === selectedCoin[0]?.market);
      if (targetData) setSelectedCoinInfo(targetData);
    }
  }, [selectedCoin, socketData]);

  const toggleFavorite = async (code, e) => {
      e.stopPropagation();
      try {
        const symbol = code.split('-')[1]; // 'KRW-BTC'에서 'BTC' 추출
        const coinName = marketCodes.find(market => market.market === code)?.korean_name;
		console.log('Sending request with:', { symbol, coinName });
        const response = await axios.post(
          `http://localhost:8080/api/favorites/${symbol}?coinName=${coinName}`,
          null,
          { withCredentials: true }
        );
		console.log('Server response:', response.data);
        if (response.data.favorited) {
          setFavoriteCoins(prev => [...prev, symbol]);
        } else {
          setFavoriteCoins(prev => prev.filter(c => c !== symbol));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          alert('로그인이 필요한 서비스입니다.');
        } else {
          console.error('즐겨찾기 설정 실패:', error);
          alert('즐겨찾기 설정에 실패했습니다.');
        }
      }
    };

  const clickCoinHandler = (evt) => {
    const currentTarget = marketCodes.filter(
      (code) => code.market === evt.currentTarget.id
    );
    setSelectedCoin(currentTarget);
  };

  
  return (
    <CoinListBox>
    <FavoriteButton onClick={() => setShowFavorites(!showFavorites)}>
          {showFavorites ? "전체코인목록" : "관심코인목록"}
        </FavoriteButton>
      <CoinBoxHeader>
      <div>코인</div>
        <div>현재가</div>
        <div>전일대비</div>
        <div>거래대금</div>
        </CoinBoxHeader>
        {/* <HavingButton onClick={() => setShowFavorites(!showHaving)}>
          {showHaving ? "전체코인목록" :"보유코인목록"}
        </HavingButton> */}
      {socketData
        ? socketData
		.filter((coin) => !showFavorites || 
		              (user && favoriteCoins.includes(coin.code.split('-')[1])))
            .map((data) => (
<CoinBox
          key={data.code}
          id={data.code}
          onClick={clickCoinHandler}
          selected={selectedCoin[0]?.market === data.code}>                
          <StarButton selected={favoriteCoins.includes(data.code.split('-')[1])} onClick={(e) => toggleFavorite(data.code, e)}>★</StarButton>
                <CoinBoxName>
                <div>{marketCodes.find((code) => code.market === data.code)?.korean_name}</div>
                <div>{marketCodes.find((code) => code.market === data.code)?.market}</div>
          </CoinBoxName>
                <CoinBoxPrice changeType={data.change}>{data.trade_price ? data.trade_price.toLocaleString("ko-KR") : "N/A"}</CoinBoxPrice>
                <div>{(data.signed_change_rate * 100).toFixed(2)}%</div>
                <div>{Math.ceil(convertMillonWon(data.acc_trade_price_24h)).toLocaleString("ko-KR")} 백만</div>
              </CoinBox>
            ))
        : null}
    </CoinListBox>
  );
};

export default memo(CoinSelector);
