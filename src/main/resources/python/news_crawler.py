from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import re

class BlockMediaCrawler:
    def __init__(self):
        self.spring_boot_url = "http://localhost:8080/api/news/crawled"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # 크롬 옵션 설정
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options) 

        self.common_keywords = [
            '비트코인', '이더리움', 'BTC', 'ETH', '암호화폐', '블록체인',
            '알트코인', '리플', 'XRP', '도지코인', 'DOGE', '테더', 'USDT',
            '바이낸스', 'NFT', '디파이', 'DeFi', '메타버스', '코인베이스',
            '가상자산', '가상화폐', '디지털자산', '채굴', '스테이킹'
        ]

    def extract_keywords(self, title, content):
        keywords = set()
        bracket_keywords = re.findall(r'\[(.*?)\]', title)
        for keyword in bracket_keywords:
            keywords.add(keyword.strip())

        text = title + ' ' + content
        for keyword in self.common_keywords:
            if keyword in text:
                keywords.add(keyword)

        return list(keywords)

    def click_load_more_button(self):
        try:
            loadmore_button = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'div.main-pagination.pagination-more > a'))
            )
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)

            try:
                loadmore_button.click()
                print("더 많은 기사를 로드 중...")
                time.sleep(3)
                return True
            except:
                self.driver.execute_script("arguments[0].click();", loadmore_button)
                print("JS로 더 많은 기사를 로드 중...")
                time.sleep(3)
                return True

        except Exception as e:
            print(f"더 이상 로드할 기사가 없거나 오류 발생: {e}")
            return False

    def crawl_news(self):
        try:
            print("\n크롤링 시작...")
            url = "https://www.blockmedia.co.kr/all-posts"
            self.driver.get(url)
            time.sleep(5)

            loaded_articles_count = 0
            click_count = 0  

            while click_count < 2:  
                soup = BeautifulSoup(self.driver.page_source, 'html.parser')
                articles = soup.select('article.l-post')
                current_count = len(articles)

                if current_count > loaded_articles_count:
                    print(f"현재까지 로드된 기사 수: {current_count}")
                    loaded_articles_count = current_count
                    if self.click_load_more_button():
                        click_count += 1  
                else:
                    print("새로운 기사가 로드되지 않았습니다.")
                    break

            print(f"총 수집된 기사 수: {loaded_articles_count}")

            for article in articles:
                try:
                    title_elem = article.select_one('h2.is-title.post-title a')
                    if not title_elem:
                        print("제목 요소를 찾을 수 없음")
                        continue

                    title = title_elem.text.strip()
                    link = title_elem['href']

                    # URL 중복 체크
                    check_response = requests.get(
                        f"http://localhost:8080/api/news/check?url={link}",
                        headers={'Accept': 'application/json'}
                    )

                    if check_response.status_code == 200 and check_response.json().get('exists', False):
                        print(f"\n중복된 URL 발견: {link}")
                        print("크롤링을 중단합니다.")
                        return  

                    print(f"\n기사 발견: {title}")

                    date_elem = article.select_one('time.post-date')
                    publish_date = datetime.strptime(date_elem['datetime'], '%Y-%m-%d %H:%M') if date_elem else datetime.now()

                    image_elem = article.select_one('span.img')
                    if image_elem:
                        bgset = image_elem.get('data-bgset', '')
                        image_url = bgset.split()[0] if bgset else image_elem.get('data-bgsrc')
                    else:
                        image_elem = article.select_one('div.media img')
                        image_url = image_elem['src'] if image_elem else None

                    print(f"상세 페이지 접근: {link}")
                    article_response = requests.get(link, headers=self.headers)
                    article_soup = BeautifulSoup(article_response.text, 'html.parser')

                    author_elem = article.select_one('span.meta-item.post-author.has-img a')
                    author = author_elem.text.strip() if author_elem else "Unknown"

                    category_elems = article.select('div.post-meta-items.meta-above span a')
                    categories = [elem.text.strip() for elem in category_elems if elem.text.strip()] or ["General"]

                    content = article_soup.select_one('div.entry-content')
                    content_text = ' '.join([p.text.strip() for p in content.select('p')]) if content else ''

                    keywords = self.extract_keywords(title, content_text)

                    news_data = {
                        'title': title,
                        'content': content_text,
                        'url': link,
                        'imageUrl': image_url,
                        'publishDate': publish_date.strftime('%Y-%m-%dT%H:%M:%S'),
                        'source': '블록미디어',
                        'author': author,
                        'categories': categories,
                        'keywords': keywords
                    }

                    print(f"본문 길이: {len(content_text)} 자")
                    self.send_to_spring_boot(news_data)
                    time.sleep(2)

                except Exception as e:
                    print(f'기사 처리 중 오류: {str(e)}')
                    continue

        except Exception as e:
            print(f'크롤링 중 오류: {str(e)}')

    def send_to_spring_boot(self, news_data):
        try:
            headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
            response = requests.post(self.spring_boot_url, json=news_data, headers=headers)

            if response.status_code == 200:
                print(f"신규 기사 저장 성공: {news_data['title']}")
            else:
                print(f"전송 실패... 상태 코드: {response.status_code}")

        except Exception as e:
            print(f'전송 중 오류 발생: {str(e)}')

    def run(self):
        try:
            print('블록미디어 크롤링 시작')
            self.crawl_news()
            print('\n크롤링 완료. 3분 대기...')
            time.sleep(180)
        finally:
            self.driver.quit()

if __name__ == "__main__":
    crawler = BlockMediaCrawler()
    crawler.run()
