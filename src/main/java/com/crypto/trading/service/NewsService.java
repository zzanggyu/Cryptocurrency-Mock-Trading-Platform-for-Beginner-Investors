package com.crypto.trading.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.crypto.trading.entity.News;
import com.crypto.trading.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;
    
    // 최신 뉴스 10개 조회
    public List<News> getLatestNews() {
        Pageable pageable = PageRequest.of(0, 7, Sort.by("publishDate").descending());
        Page<News> newsPage = newsRepository.findAllByOrderByPublishDateDesc(pageable);
        return newsPage.getContent();
    }
}