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
from selenium.webdriver.common.action_chains import ActionChains

class BlockMediaCrawler:
    def __init__(self):
        self.spring_boot_url = "http://localhost:8080/api/news/crawled"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # 크롬 옵션 설정
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # 헤드리스 모드 (크롬 창 안 보임)
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
            click_count = 0  # 클릭 횟수를 추적하기 위한 변수 추가
            while click_count < 2:  # 2번만 반복하도록 수정
                soup = BeautifulSoup(self.driver.page_source, 'html.parser')
                articles = soup.select('article.l-post')
                current_count = len(articles)
                
                if current_count > loaded_articles_count:
                    print(f"현재까지 로드된 기사 수: {current_count}")
                    loaded_articles_count = current_count
                    
                    if self.click_load_more_button():
                       click_count += 1  # 클릭 성공시 카운트 증가
                else:
                    print("새로운 기사가 로드되지 않았습니다.")
                    break

            print("크롤링 시작...")
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            articles = soup.select('article.l-post')
            print(f"총 수집된 기사 수: {len(articles)}")

            for article in articles:
                try:
                    title_elem = article.select_one('h2.is-title.post-title a')
                    if not title_elem:
                        print("제목 요소를 찾을 수 없음")
                        continue   
                    
                    title = title_elem.text.strip()
                    link = title_elem['href']
                    print(f"\n기사 발견: {title}")
                    
                    date_elem = article.select_one('time.post-date')
                    publish_date = datetime.strptime(date_elem['datetime'], '%Y-%m-%d %H:%M') if date_elem else datetime.now()

                    image_elem = article.select_one('span.img')
                    if image_elem:
                        bgset = image_elem.get('data-bgset', '')
                        if bgset:
                            image_url = bgset.split()[0]
                        else:
                            image_url = image_elem.get('data-bgsrc')
                    else:
                        image_elem = article.select_one('div.media img')
                        image_url = image_elem['src'] if image_elem else None

                    if not image_url:
                        print(f"이미지를 찾을 수 없음: {title}")
                    
                    print(f"상세 페이지 접근: {link}")
                    article_response = requests.get(link, headers=self.headers)
                    article_soup = BeautifulSoup(article_response.text, 'html.parser')
                    
                    # 작성자 추출
                    author_elem = article.select_one('span.meta-item.post-author.has-img a')
                    author = author_elem.text.strip() if author_elem else "Unknown"
                    
                    # 카테고리 추출 수정 - 여러 카테고리 가져오기
                    category_elems = article.select('div.post-meta-items.meta-above span a')
                    categories = [elem.text.strip() for elem in category_elems if elem.text.strip()]
                    if not categories:
                        categories = ["General"]
                    
                    content = article_soup.select_one('div.entry-content')
                    if content:
                        paragraphs = content.select('p')
                        content_text = ' '.join([p.text.strip() for p in paragraphs if p.text.strip()])
                    else:
                        print("본문을 찾을 수 없음")
                        content_text = ''
                    
                    keywords = self.extract_keywords(title, content_text)

                    news_data = {
                        'title': title,
                        'content': content_text,
                        'url': link,
                        'imageUrl': image_url,
                        'publishDate': publish_date.strftime('%Y-%m-%dT%H:%M:%S'),
                        'source': '블록미디어',
                        'author': author,
                        'categories': categories,  # 카테고리 리스트로 변경
                        'keywords': keywords
                    }
                    
                    print(f"본문 길이: {len(content_text)} 자")
                    print(f"이미지 URL: {image_url}")
                    print(f"작성자: {author}")
                    print(f"카테고리: {categories}")  # 수정된 부분
                    print(f"추출된 키워드: {keywords}")
                    
                    self.send_to_spring_boot(news_data)
                    time.sleep(2)
                    
                except Exception as e:
                    print(f'기사 처리 중 오류: {str(e)}')
                    continue
                        
        except Exception as e:
            print(f'크롤링 중 오류: {str(e)}')

    def send_to_spring_boot(self, news_data):
        try:
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            
            print("\n=== 전송할 데이터 상세 ===")
            print(f"제목: {news_data['title']}")
            print(f"URL: {news_data['url']}")
            print(f"이미지 URL: {news_data['imageUrl']}")
            print(f"본문 길이: {len(news_data['content'])}")
            print(f"발행일: {news_data['publishDate']}")
            print(f"출처: {news_data['source']}")
            print(f"작성자: {news_data['author']}")
            print(f"카테고리: {news_data['categories']}")  # 수정된 부분
            print(f"키워드: {news_data['keywords']}")
            print("========================")
            
            response = requests.post(
                self.spring_boot_url,
                json=news_data,
                headers=headers
            )
            
            if response.status_code == 200:
                if response.text:
                    print(f"신규 기사 저장 성공: {news_data['title']}")
                else:
                    print(f"이미 존재하는 기사입니다: {news_data['title']}")
            else:
                print(f"전송 실패... 상태 코드: {response.status_code}")
                print(f"에러 메시지: {response.text}")
            
            return response
                
        except Exception as e:
            print(f'전송 중 오류 발생: {str(e)}')
            return None
    
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