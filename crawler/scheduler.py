import time
import subprocess

while True:
    try:
        # main.py 실행
        subprocess.run(["python", "main.py"], check=True)
        print("main.py 실행 완료. 1분 대기 중...")
    except subprocess.CalledProcessError as e:
        print(f"main.py 실행 중 오류 발생: {e}")
    except Exception as e:
        print(f"알 수 없는 오류 발생: {e}")
    
    # 1분 대기
    time.sleep(60)
