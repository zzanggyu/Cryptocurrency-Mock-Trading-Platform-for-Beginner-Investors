package com.crypto.trading.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.crypto.trading.service.OrderService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class SchedulerConfig {
    
    private final OrderService orderService;
    
    // 1초마다 주문 처리
    @Scheduled(fixedRate = 1000)
    public void processOrders() {
        orderService.processOrders();
    }
}