from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime

def get_buying_rank(driver):
   try:
       # 페이지 로드 대기
       WebDriverWait(driver, 10).until(
           EC.presence_of_all_elements_located((By.CLASS_NAME, "LineArticle__List"))
       )

       # 모든 LineArticle__List 가져오기
       lists = driver.find_elements(By.CLASS_NAME, "LineArticle__List")
       if len(lists) >= 2:
           second_list = lists[1]  # 두 번째 리스트 선택
           list_items = second_list.find_elements(By.CSS_SELECTOR, "li")

           # 데이터 추출
           data = []
           current_time = datetime.now().isoformat()
           
           for idx, item in enumerate(list_items, 1):
               try:
                   title = item.find_element(By.CSS_SELECTOR, ".LineArticle__ItemTitle").text.strip()
                   change = item.find_element(By.CSS_SELECTOR, ".LineArticle__ItemChange").text.strip()
                   data.append({
                       "id": idx,
                       "title": title, 
                       "changePercent": change, 
                       "createdAt": current_time
                   })
               except Exception as e:
                   print(f"데이터 추출 오류: {e}")
           return data
       else:
           print("두 번째 LineArticle__List를 찾을 수 없습니다.")
           return []

   except Exception as e:
       print(f"크롤링 중 오류 발생: {e}")
       return []