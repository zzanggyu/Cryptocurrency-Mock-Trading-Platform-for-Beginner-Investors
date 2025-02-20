package com.crypto.trading.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;

/**
 * 뉴스 크롤링을 자동으로 실행하는 스케줄러 서비스
 * Spring Boot 애플리케이션이 실행되면 자동으로 시작되며,
 * 정해진 간격으로 Python 크롤러를 실행합니다.
 */
@Service    // 스프링의 서비스 컴포넌트로 등록
public class CrawlingSchedulerService {
    
    // 로깅을 위한 Logger 설정
    private static final Logger logger = LoggerFactory.getLogger(CrawlingSchedulerService.class);
    
    @Scheduled(fixedRate = 300000)
    public void runCrawler() {
        logger.info("크롤링 스케줄러 시작: {}", LocalDateTime.now());
        
        try {
            // resources/python 폴더에서 크롤러 스크립트 파일 경로 가져오기
            String scriptPath = new ClassPathResource("python/news_crawler.py").getFile().getAbsolutePath();
            
            // 파이썬 프로세스 빌더 설정
            ProcessBuilder processBuilder = new ProcessBuilder("python", scriptPath);
            processBuilder.redirectErrorStream(true);  // 에러 스트림과 일반 출력 스트림을 통합
            
            // 파이썬 프로세스 실행
            Process process = processBuilder.start();
            
            // 프로세스의 출력을 실시간으로 읽어서 로깅
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    logger.info("크롤러 출력: {}", line);
                }
            }
            
            // 프로세스가 종료될 때까지 대기
            int exitCode = process.waitFor();
            logger.info("크롤링 완료. Exit Code: {}", exitCode);
            // exitCode가 0이면 정상 종료, 그 외는 에러
            
        } catch (Exception e) {
            // 크롤링 실행 중 발생하는 모든 예외를 로깅
            logger.error("크롤링 실행 중 오류 발생: ", e);
        }
    }
}