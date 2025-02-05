import time
import subprocess
import pytz
from datetime import datetime, timedelta

def print_korean_time():
    korean_tz = pytz.timezone('Asia/Seoul')
    current_time = datetime.now(korean_tz).strftime('%Y-%m-%d %H:%M:%S %Z')
    return current_time

def wait_until_next_minute():
    # 다음 분의 시작(00초)까지 대기하는 시간 계산
    now = datetime.now()
    seconds_until_next_minute = 60 - now.second
    time.sleep(seconds_until_next_minute)

while True:
    try:
        # 다음 분 시작까지 대기
        wait_until_next_minute()
        
        # 현재 한국 시간 출력
        print(f"\n현재 시간 (한국): {print_korean_time()}")
        
        # main.py 실행
        subprocess.run(["python", "main.py"], check=True)
        print(f"main.py 실행 완료")
        
    except subprocess.CalledProcessError as e:
        print(f"main.py 실행 중 오류 발생: {e}")
    except Exception as e:
        print(f"알 수 없는 오류 발생: {e}")
    
    # 다음 실행 시간 출력
    next_run = datetime.now(pytz.timezone('Asia/Seoul')) + timedelta(minutes=1)
    print(f"다음 실행 예정 시간: {next_run.strftime('%Y-%m-%d %H:%M:%S %Z')}")