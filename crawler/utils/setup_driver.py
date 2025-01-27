from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

def setup_driver():
    """
    Selenium WebDriver 설정 및 초기화
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # 브라우저 UI 숨김
    chrome_options.add_argument("--disable-gpu")  # GPU 비활성화
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-software-rasterizer")  # 소프트웨어 렌더링 비활성화
    service = Service()
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver