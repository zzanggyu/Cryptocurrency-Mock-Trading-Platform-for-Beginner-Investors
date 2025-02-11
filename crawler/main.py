import os
import pandas as pd
from utils.setup_driver import setup_driver
from utils.send_data import send_to_spring_boot
from crawling_data.weekly_trends import get_weekly_trends
from datetime import datetime
from crawling_data.asset_info import get_asset_info
from crawling_data.market_cap import get_market_data
from crawling_data.buying_rank import get_buying_rank
from crawling_data.selling_rank import get_selling_rank

csv_directory = "csv"
if not os.path.exists(csv_directory):
    os.makedirs(csv_directory)

def get_all_data(driver):
    try:
        current_time = datetime.now().isoformat()
        
        # 모든 데이터 크롤링
        data = {
            "weeklyTrends": get_weekly_trends(driver),
            "assetInfo": get_asset_info(driver),
            "marketData": get_market_data(driver),
            "buyingRank": get_buying_rank(driver),
            "sellingRank": get_selling_rank(driver)
        }

        # 모든 데이터에 시간 추가 및 CSV 저장
        for key, items in data.items():
            for item in items:
                item["createdAt"] = current_time
            
            df = pd.DataFrame(items)
            file_name = f"{key}.csv"
            df.to_csv(os.path.join(csv_directory, file_name), index=False, encoding="utf-8-sig")
            print(f"데이터 저장 완료: {file_name}")

        # Spring Boot로 모든 데이터 한번에 전송
        send_to_spring_boot(data, "all-data")
        print("모든 데이터 전송 완료")

        return data

    except Exception as e:
        print(f"데이터 수집 중 오류 발생: {e}")
        return None

def main():
    driver = setup_driver()
    try:
        url = "https://upbit.com/trends"
        driver.get(url)
        
        all_data = get_all_data(driver)
        if all_data:
            print("모든 데이터 크롤링 완료")
        
    except Exception as e:
        print(f"오류 발생: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()