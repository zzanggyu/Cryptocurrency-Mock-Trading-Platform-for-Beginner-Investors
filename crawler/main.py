import pandas as pd
from utils.setup_driver import setup_driver
from utils.send_data import send_to_spring_boot
from weekly_trends import get_weekly_trends
from datetime import datetime
from asset_info import get_asset_info
from market_cap import get_market_data

def main():
   driver = setup_driver()

   try:
       url = "https://upbit.com/trends"
       driver.get(url)

       # 주간 상승률 크롤링
       weekly_trends = get_weekly_trends(driver)
       current_time = datetime.now().isoformat()
       for item in weekly_trends:
           item["createdAt"] = current_time

       df = pd.DataFrame(weekly_trends)
       df.to_csv("coin_data.csv", index=False, encoding="utf-8-sig")
       print("데이터 저장 완료: coin_data.csv")
       send_to_spring_boot(weekly_trends, "coins")
       
       print("-----------------------------------------------------")

       # 자산 정보 크롤링
       asset_info = get_asset_info(driver)
       df = pd.DataFrame(asset_info)
       df.to_csv("asset_info.csv", index=False, encoding="utf-8-sig")
       print("데이터 저장 완료: asset_info.csv")
       send_to_spring_boot(asset_info, "assets")

       print("-----------------------------------------------------")

       # 시가총액 정보 크롤링
       market_data = get_market_data(driver)
       for item in market_data:
           item["createdAt"] = current_time
       df = pd.DataFrame(market_data)
       df.to_csv("market_data.csv", index=False, encoding="utf-8-sig")
       print("데이터 저장 완료: market_data.csv")
       send_to_spring_boot(market_data, "markets")

   except Exception as e:
       print(f"오류 발생: {e}")
   finally:
       driver.quit()

if __name__ == "__main__":
   main()