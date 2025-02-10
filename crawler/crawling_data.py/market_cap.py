from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime 
import time

# 데이터 크롤링 함수
def get_market_data(driver):
   try:
       market_data_list = []

       # 시가총액 탭 클릭
       try:
           tab_labels = WebDriverWait(driver, 10).until(
               EC.presence_of_all_elements_located((By.CLASS_NAME, "LineArticle__TabLabel"))
           )
           # 시가총액 텍스트가 있는 탭 찾아서 클릭
           for tab in tab_labels:
               if "시가총액" in tab.text:
                   tab.click()
                   time.sleep(2)
                   break
       except Exception as e:
           print("시가총액 탭 클릭 실패:", e)
           return []

       # 전체보기 버튼 클릭
       try:
           view_all_button = WebDriverWait(driver, 10).until(
               EC.element_to_be_clickable((By.CLASS_NAME, "LineArticle__MoreBtn"))
           )
           view_all_button.click()
           time.sleep(2)
       except Exception as e:
           print("전체보기 버튼 클릭 실패:", e)

       # 테이블 데이터 가져오기
       table = WebDriverWait(driver, 10).until(
           EC.presence_of_element_located((By.CLASS_NAME, "LineArticle__Table"))
       )

       rows = table.find_elements(By.TAG_NAME, "tr")

       # enumerate를 사용하여 인덱스를 id로 활용
       for idx, row in enumerate(rows[1:], 1):  # 1부터 시작하는 인덱스
           cols = row.find_elements(By.TAG_NAME, "td")
           if len(cols) >= 4:
               market_data_list.append({
                   "id": idx,  # id 직접 지정
                   "rank": cols[0].text.strip(),
                   "name": cols[1].text.strip(),
                   "marketcap": cols[2].text.strip(),
                   "transactionvalue": cols[3].text.strip(),
                   "createdAt": datetime.now().isoformat()
               })

       return market_data_list

   except Exception as e:
       print(f"get_market_data 오류 발생: {e}")
       return []