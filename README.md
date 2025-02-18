코인 정보 대시보드
# 프로젝트 개요
이 프로젝트는 Upbit의 코인 시세 및 관련 정보를 실시간으로 수집하고 보여주는 웹 애플리케이션입니다.
주요 기능

# 실시간 코인 시세 정보 조회
주간 트렌드 분석
매수/매도 순위 확인
디지털 자산 정보 조회
시가총액 순위 확인

# 기술 스택
## Frontend

React.js
CSS Modules
Axios for API calls

## Backend (Crawler)

Python
Selenium
BeautifulSoup4
Pandas
Scheduler

# 데이터 수집 항목

주간 트렌드 (weeklyTrends.csv)
디지털 자산 정보 (assetInfo.csv)
시가총액 정보 (marketData.csv)
매수 순위 (buyingRank.csv)
매도 순위 (sellingRank.csv)

# 업데이트 주기

기본 데이터 수집: 5초 간격
실시간 모니터링: 10초 간격