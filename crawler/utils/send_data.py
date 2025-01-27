import requests


def send_to_spring_boot(data, endpoint):
    """
    데이터를 Spring Boot API로 전송합니다.

    Parameters:
        data (list): 전송할 데이터
        endpoint (str): Spring Boot API 엔드포인트
    """
    url = f"http://localhost:8080/api/{endpoint}"
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print(f"{endpoint} 데이터 전송 성공")
    else:
        print(f"{endpoint} 데이터 전송 실패: {response.status_code}, {response.text}")