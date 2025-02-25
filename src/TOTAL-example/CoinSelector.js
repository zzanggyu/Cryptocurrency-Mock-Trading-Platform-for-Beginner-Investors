import { memo, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { useWsTicker } from "use-upbit-api";
import { marketCodesState, selectedCoinInfoState, selectedCoinState } from "./atom";


const convertMillonWon = (value) => value / 1000000;

const ListButton = styled.button`
  width: 30%;  // 3개 버튼이 균등하게 배치되도록 너비 조정
  margin: 5px;
  color: black;
  background-color: ${props => props.active ? '#e6f2ff' : 'white'};  // 활성화된 버튼 강조
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-family: Arial, sans-serif;
  font-weight: 600;
  padding: 8px 0;
  :hover {
    background-color: lightgrey;
  }
`;

const CoinListBox = styled.div`
  height: 800px;
  margin: 5px;
  width: 135%;
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

// HavingButton 스타일 추가 (FavoriteButton 스타일 아래에)
const HavingButton = styled(FavoriteButton)`
  margin-left: 5px;
  width: 100px;
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
  const [showHaving, setShowHaving] = useState(false);
  const [holdings, setHoldings] = useState([]);
  // 상태 변경
  const [listMode, setListMode] = useState('all');
  
    // 목록 모드 변경 함수
    const changeListMode = (mode) => {
      setListMode(mode);
    };

    // 보유코인 정보 가져오기
    // 보유코인 정보 가져오기
useEffect(() => {
  const fetchHoldings = async () => {
    try {
      // 1. 세션 체크 (로그인 여부)
      console.log('세션 체크 시작');
      const sessionResponse = await fetch('http://localhost:8080/api/check-session', {
        credentials: 'include'
      });
      
      if (!sessionResponse.ok) {
        console.error('세션 오류:', sessionResponse.status);
        return;
      }
      
      const userInfo = await sessionResponse.json();
      console.log('사용자 정보:', userInfo);
      
      // 2. 계좌 정보 가져오기
      console.log('계좌 정보 요청');
      const accountsResponse = await fetch(`http://localhost:8080/api/accounts/user/${userInfo.username}`, {
        credentials: 'include'
      });
      
      if (!accountsResponse.ok) {
        console.error('계좌 정보 오류:', accountsResponse.status);
        return;
      }
      
      const accounts = await accountsResponse.json();
      console.log('계좌 정보:', accounts);
      
      if (!accounts || accounts.length === 0) {
        console.error('계좌가 없습니다');
        return;
      }
      
      // 3. 보유 코인 정보 가져오기
      console.log('보유 코인 정보 요청:', accounts[0].id);
      const holdingsResponse = await fetch(`http://localhost:8080/api/transactions/account/${accounts[0].id}/summary`, {
        credentials: 'include'
      });
      
      if (!holdingsResponse.ok) {
        console.error('보유 코인 정보 오류:', holdingsResponse.status);
        return;
      }
      
      const holdingsData = await holdingsResponse.json();
      console.log('보유 코인 정보:', holdingsData);
      
      // 응답이 배열인지 확인
      setHoldings(Array.isArray(holdingsData) ? holdingsData : []);
    } catch (error) {
      console.error('보유코인 조회 실패:', error);
    }
  };

  // 초기 데이터 로드
  fetchHoldings();
  
  // 5초마다 보유코인 정보 갱신 (주기를 짧게 설정)
  const intervalId = setInterval(fetchHoldings, 5000);
  
  // 컴포넌트 언마운트시 인터벌 정리
  return () => clearInterval(intervalId);
}, []);

  useEffect(() => {
    if (socketData) {
      const targetData = socketData.find((data) => data.code === selectedCoin[0]?.market);
      if (targetData) setSelectedCoinInfo(targetData);
    }
  }, [selectedCoin, socketData]);

  // 관심코인 목록 불러오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // 세션 체크 (로그인 여부)
        const sessionResponse = await fetch('http://localhost:8080/api/check-session', {
          credentials: 'include'
        });
        
        if (!sessionResponse.ok) {
          console.error('세션 오류:', sessionResponse.status);
          return;
        }
        
        // 관심코인 목록 가져오기
        const favoritesResponse = await fetch('http://localhost:8080/api/favorites', {
          credentials: 'include'
        });
        
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          // 코인 코드 목록 추출 (KRW-BTC 형식으로)
          const favoriteSymbols = favoritesData.map(favorite => `KRW-${favorite.symbol}`);
          setFavoriteCoins(favoriteSymbols);
        }
      } catch (error) {
        console.error('관심코인 조회 실패:', error);
      }
    };

    fetchFavorites();
  }, []);

  // 관심코인 추가/삭제 함수 수정
  const toggleFavorite = async (coin) => {
    try {
      // 코인 심볼 추출 (KRW-BTC → BTC)
      const coinSymbol = coin.replace('KRW-', '');
      const coinName = marketCodes.find(code => code.market === coin)?.korean_name || '';
      
      // 이미 관심코인이면 삭제, 아니면 추가
      if (favoriteCoins.includes(coin)) {
        // 관심코인 삭제 API 호출
        const response = await fetch(`http://localhost:8080/api/favorites/${coinSymbol}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setFavoriteCoins(prev => prev.filter(item => item !== coin));
        }
      } else {
        // 관심코인 추가 API 호출
        const response = await fetch('http://localhost:8080/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            symbol: coinSymbol,
            coinname: coinName
          })
        });
        
        if (response.ok) {
          setFavoriteCoins(prev => [...prev, coin]);
        }
      }
    } catch (error) {
      console.error('관심코인 업데이트 실패:', error);
      alert('관심코인 업데이트에 실패했습니다.');
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
      <div style={{ display: 'flex' }}>
        <ListButton 
          active={listMode === 'all'} 
          onClick={() => changeListMode('all')}
        >
          전체코인
        </ListButton>
        <ListButton 
          active={listMode === 'favorites'} 
          onClick={() => changeListMode('favorites')}
        >
          관심코인
        </ListButton>
        <ListButton 
          active={listMode === 'holdings'} 
          onClick={() => changeListMode('holdings')}
        >
          보유코인
        </ListButton>
      </div>
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
          .filter((coin) => {
            if (listMode === 'holdings') {
              return Array.isArray(holdings) && holdings.some(h => `KRW-${h.coinSymbol}` === coin.code);
            } else if (listMode === 'favorites') {
              return favoriteCoins.includes(coin.code);
            }
            return true; // 전체코인 모드에서는 모든 코인 표시
          })
          .map((data) => (
<CoinBox
          key={data.code}
          id={data.code}
          onClick={clickCoinHandler}
          selected={selectedCoin[0]?.market === data.code}>                
          <StarButton selected={favoriteCoins.includes(data.code)} onClick={(e) => { e.stopPropagation(); toggleFavorite(data.code); }}>★</StarButton>
                <CoinBoxName>
                <div>{marketCodes.find((code) => code.market === data.code)?.korean_name}</div>
                <div>{marketCodes.find((code) => code.market === data.code)?.market}</div>
          </CoinBoxName>
                <CoinBoxPrice changeType={data.change}>{data.trade_price.toLocaleString("ko-KR")}</CoinBoxPrice>
                <div>{(data.signed_change_rate * 100).toFixed(2)}%</div>
                <div>{Math.ceil(convertMillonWon(data.acc_trade_price_24h)).toLocaleString("ko-KR")} 백만</div>
              </CoinBox>
            ))
        : null}
    </CoinListBox>
  );
};

export default memo(CoinSelector);