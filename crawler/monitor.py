# monitor.py
import time
import pytz
from datetime import datetime
from utils.setup_driver import setup_driver
from weekly_trends import get_weekly_trends
from asset_info import get_asset_info
from market_cap import get_market_data
from buying_rank import get_buying_rank
from selling_rank import get_selling_rank

def print_korean_time():
    korean_tz = pytz.timezone('Asia/Seoul')
    current_time = datetime.now(korean_tz).strftime('%Y-%m-%d %H:%M:%S %Z')
    return current_time

def monitor_updates():
    driver = setup_driver()
    previous_data = None
    
    try:
        print("업비트 데이터 갱신 시간 모니터링 시작...")
        url = "https://upbit.com/trends"
        driver.get(url)
        
        while True:
            current_data = {
                "weeklyTrends": get_weekly_trends(driver),
                "assetInfo": get_asset_info(driver),
                "marketData": get_market_data(driver),
                "buyingRank": get_buying_rank(driver),
                "sellingRank": get_selling_rank(driver)
            }
            
            current_time = print_korean_time()
            
            if previous_data:
                changes = []
                for key in current_data:
                    if str(previous_data[key]) != str(current_data[key]):
                        changes.append(key)
                
                if changes:
                    print(f"\n데이터 갱신 감지! 시간: {current_time}")
                    print(f"변경된 데이터: {', '.join(changes)}")
            
            previous_data = current_data
            time.sleep(10)  # 10초마다 체크
            
    except Exception as e:
        print(f"모니터링 중 오류 발생: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    monitor_updates()