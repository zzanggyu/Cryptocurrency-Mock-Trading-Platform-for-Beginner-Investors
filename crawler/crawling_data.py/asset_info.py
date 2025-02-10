from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime 

def get_asset_info(driver):
   """
   디지털 자산 정보를 크롤링하는 함수.

   Args:
       driver (webdriver): Selenium WebDriver 객체.

   Returns:
       list: 디지털 자산 정보를 포함하는 dict 리스트.
   """
   try:
       asset_info_list = []

       # "전체보기" 버튼 클릭
       try:
           view_all_button = WebDriverWait(driver, 10).until(
               EC.element_to_be_clickable((By.CLASS_NAME, "LineArticle__MoreBtn"))
           )
           view_all_button.click()
           time.sleep(2)
       except Exception as e:
           print("전체보기 버튼을 클릭할 수 없습니다:", e)

       # 테이블 요소 찾기
       table = WebDriverWait(driver, 10).until(
           EC.presence_of_element_located((By.CLASS_NAME, "BasicTable.CryptNewsTable.CryptNewsTable--Period"))
       )

       # 테이블의 행 찾기 (tbody)
       rows = table.find_elements(By.TAG_NAME, "tr")

       # 데이터 추출
       for idx, row in enumerate(rows[1:], 1):  # 첫 번째 행은 헤더이므로 건너뜀
           columns = row.find_elements(By.TAG_NAME, "td")

           # 필요한 데이터 추출
           if len(columns) >= 4:
               asset_name = columns[0].text.strip()
               weekly_gain = columns[2].text.strip()
               monthly_gain = columns[3].text.strip()
               threemonth_gain = columns[4].text.strip()
               sixmonth_gain = columns[5].text.strip()
               yearly_gain = columns[6].text.strip()

               # 데이터 구조화 (id 추가)
               asset_info_list.append({
                   "id": idx,
                   "name": asset_name,
                   "weeklyGain": weekly_gain,
                   "monthlyGain": monthly_gain,
                   "threemonthGain": threemonth_gain,
                   "sixmonthGain": sixmonth_gain,
                   "yearlyGain": yearly_gain,
                   "createdAt": datetime.now().isoformat()
               })

       return asset_info_list

   except Exception as e:
       print(f"get_asset_info 오류 발생: {e}")
       return []
