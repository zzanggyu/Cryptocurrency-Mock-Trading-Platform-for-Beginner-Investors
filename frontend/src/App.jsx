import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
 const [allData, setAllData] = useState({
   weeklyTrends: [],
   assetInfo: [],
   marketData: [],
   buyingRank: [],
   sellingRank: []
 });

 // 더보기 상태관리
 const [showAllAssets, setShowAllAssets] = useState(false);
 const [showAllMarket, setShowAllMarket] = useState(false);

 const getValueClass = (value) => {
   if (value?.includes('+')) {
     return 'positive-value';
   } else if (value?.includes('-')) {
     return 'negative-value';
   }
   return '';
 };

 useEffect(() => {
   const fetchData = async () => {
     try {
       const response = await axios.get('http://localhost:8080/api/all-data');
       console.log('받아온 데이터:', response.data);
       setAllData(response.data);
     } catch (error) {
       console.error('데이터 가져오기 실패:', error);
     }
   };

   fetchData();
   const interval = setInterval(fetchData, 60000);
   return () => clearInterval(interval);
 }, []);

 // 표시할 데이터 개수 제한
 const displayedAssets = showAllAssets ? allData.assetInfo : allData.assetInfo.slice(0, 10);
 const displayedMarket = showAllMarket ? allData.marketData : allData.marketData.slice(0, 10);

 return (
   <div>
    <nav className="tab-nav">
       <button className="tab-button">거래소</button>
       <button className="tab-button">입출금</button>
       <button className="tab-button">투자내역</button>
       <button className="tab-button">코인동향</button>
       <button className="tab-button">서비스+</button>
       <button className="tab-button">NFT ⌃</button>
     </nav>
     <h1>암호화폐 데이터</h1>
     
     <h2>주간 상승률</h2>
     <table>
       <thead>
         <tr>
           <th>순위</th>
           <th>코인명</th>
           <th>변동률</th>
         </tr>
       </thead>
       <tbody>
         {allData.weeklyTrends.map((item) => (
           <tr key={item.id}>
             <td>{item.id}</td>
             <td>{item.title}</td>
             <td className={getValueClass(item.changePercent)}>{item.changePercent}</td>
           </tr>
         ))}
       </tbody>
     </table>

     <h2>자산 정보</h2>
     <table>
       <thead>
         <tr>
           <th>자산명</th>
           <th>주간 상승률</th>
           <th>월간 상승률</th>
           <th>3개월 상승률</th>
           <th>6개월 상승률</th>
           <th>연간 상승률</th>
         </tr>
       </thead>
       <tbody>
         {displayedAssets.map((item) => (
           <tr key={item.id}>
             <td>{item.name}</td>
             <td className={getValueClass(item.weeklyGain)}>{item.weeklyGain}</td>
             <td className={getValueClass(item.monthlyGain)}>{item.monthlyGain}</td>
             <td className={getValueClass(item.threemonthGain)}>{item.threemonthGain}</td>
             <td className={getValueClass(item.sixmonthGain)}>{item.sixmonthGain}</td>
             <td className={getValueClass(item.yearlyGain)}>{item.yearlyGain}</td>
           </tr>
         ))}
       </tbody>
     </table>
     {allData.assetInfo.length > 10 && (
       <button onClick={() => setShowAllAssets(!showAllAssets)} className="more-button">
         {showAllAssets ? '접기' : '더보기'}
       </button>
     )}

     <h2>시가총액 정보</h2>
     <table>
       <thead>
         <tr>
           <th>순위</th>
           <th>코인명</th>
           <th>시가총액</th>
           <th>거래대금</th>
         </tr>
       </thead>
       <tbody>
         {displayedMarket.map((item) => (
           <tr key={item.id}>
             <td>{item.rank}</td>
             <td>{item.name}</td>
             <td>{item.marketcap}</td>
             <td>{item.transactionvalue}</td>
           </tr>
         ))}
       </tbody>
     </table>
     {allData.marketData.length > 10 && (
       <button onClick={() => setShowAllMarket(!showAllMarket)} className="more-button">
         {showAllMarket ? '접기' : '더보기'}
       </button>
     )}

     <h2>매수 체결 강도</h2>
     <table>
       <thead>
         <tr>
           <th>순위</th>
           <th>코인명</th>
           <th>변동률</th>
         </tr>
       </thead>
       <tbody>
         {allData.buyingRank.map((item) => (
           <tr key={item.id}>
             <td>{item.id}</td>
             <td>{item.title}</td>
             <td className={getValueClass(item.changePercent)}>{item.changePercent}</td>
           </tr>
         ))}
       </tbody>
     </table>

     <h2>매도 체결 강도</h2>
     <table>
       <thead>
         <tr>
           <th>순위</th>
           <th>코인명</th>
           <th>변동률</th>
         </tr>
       </thead>
       <tbody>
         {allData.sellingRank.map((item) => (
           <tr key={item.id}>
             <td>{item.id}</td>
             <td>{item.title}</td>
             <td className={getValueClass(item.changePercent)}>{item.changePercent}</td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 )
}

export default App