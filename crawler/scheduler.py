import time
import subprocess
import pytz
from datetime import datetime, timedelta

def print_korean_time():
    korean_tz = pytz.timezone('Asia/Seoul')
    current_time = datetime.now(korean_tz).strftime('%Y-%m-%d %H:%M:%S %Z')
    return current_time

def wait_until_next_update():
    time.sleep(10)  # 10초 간격으로 실행

while True:
    try:
        print(f"\n현재 시간 (한국): {print_korean_time()}")
        
        # main.py 실행
        subprocess.run(["python", "main.py"], check=True)
        print(f"main.py 실행 완료")
        
        # 다음 실행 시간 출력
        next_run = datetime.now(pytz.timezone('Asia/Seoul')) + timedelta(seconds=25)
        print(f"다음 실행 예정 시간: {next_run.strftime('%Y-%m-%d %H:%M:%S %Z')}")
        
        # 다음 갱신 시간까지 대기
        wait_until_next_update()
        
    except subprocess.CalledProcessError as e:
        print(f"main.py 실행 중 오류 발생: {e}")
    except Exception as e:
        print(f"알 수 없는 오류 발생: {e}")