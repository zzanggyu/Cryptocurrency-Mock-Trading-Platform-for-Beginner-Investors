# Cryptocurrency-Mock-Trading-Platform-for-Beginner-Investors

# 초보 투자자를 위한 가상화폐 모의투자 플랫폼

## 프로젝트 배경

가상화폐 시장이 확대되면서 많은 초보 투자자들이 시장에 참여하고 있습니다. 하지만 투자 경험 부족과 감정적 투자로 인해 큰 손실을 겪는 경우가 많습니다. 특히 계좌 관리와 포트폴리오 구성에 어려움을 느끼는 투자자들이 많아, 이들을 위한 체계적인 투자 관리 시스템이 필요한 상황입니다.

## 프로젝트 목적

본 프로젝트는 초보 투자자들이 안전하게 가상화폐 투자를 시작할 수 있도록 돕는 플랫폼을 개발하는 것을 목적으로 합니다. 투자자의 성향을 분석하고, 이에 맞는 투자 한도를 설정하여 과도한 투자를 방지하며, 분할 투자 원칙을 시스템적으로 지원합니다.

## 주요 기능

1. 실시간 시장 정보 제공
    - Upbit API 연동을 통한 실시간 차트 제공
    - 기본적인 매수/매도 기능 구현
2. 맞춤형 투자 관리
    - 회원가입 시 투자성향 분석
    - 투자성향에 따른 맞춤형 포트폴리오 추천
    - 계좌 잔고 기반 투자 한도 설정
3. 리스크 관리 시스템
    - 분할 투자 강제화
    - 계좌 잔고 대비 투자 비율 제한
    - 추가 매수 시 경고 메시지 제공

## 기대 효과

- 초보 투자자들의 무분별한 투자 방지
- 체계적인 포트폴리오 관리 지원
- 감정적 투자 억제를 통한 투자 손실 최소화
- 건전한 투자 문화 형성에 기여

## 차별성

기존의 가상화폐 거래 플랫폼들이 단순히 거래 기능만을 제공하는 것과 달리, 본 플랫폼은 초보 투자자의 안전한 투자를 위한 다양한 보호 장치와 관리 기능을 제공합니다. 특히 분할 투자 원칙을 시스템적으로 구현하여 투자자들이 보다 안정적으로 자산을 관리할 수 있도록 지원합니다.

## 개발 환경

1. 백엔드 (Spring Boot)
    - Spring Security로 안전한 인증/인가 처리
    - WebSocket 지원으로 실시간 가격 정보 처리
    - JPA로 효율적인 데이터베이스 관리
    - 확장성과 유지보수성이 뛰어난 아키텍처 제공
2. 프론트엔드 (React)
    - React Query로 서버 상태 관리 및 캐싱
    - Redux Toolkit으로 복잡한 상태 관리
    - Chart.js로 다양한 차트 구현
    - WebSocket으로 실시간 데이터 처리
    - 반응형 UI 구현
3. 데이터베이스 (MySQL)
    - 트랜잭션 처리가 안정적
    - 사용자 데이터, 거래 내역 등의 관계형 데이터 처리에 적합
    - 백업과 복구가 용이
4. 추가 제안 사항:
    - Redis 도입: 실시간 시세 데이터 캐싱용
    - Docker: 개발 환경 표준화 및 배포 자동화
    - Gradle: 의존성 관리 및 빌드 자동화

특히 이 프로젝트에서 중요한 점:

1. 실시간 데이터 처리를 위한 WebSocket 구현
2. 사용자 투자 성향 분석을 위한 알고리즘 설계
3. 보안 강화를 위한 인증/인가 시스템 구축
4. 확장성을 고려한 모듈러 아키텍처 설계

