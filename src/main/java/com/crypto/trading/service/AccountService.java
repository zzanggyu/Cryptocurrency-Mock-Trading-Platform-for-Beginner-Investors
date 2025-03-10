package com.crypto.trading.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.trading.dto.AccountCreateRequest;
import com.crypto.trading.dto.AccountResponse;
import com.crypto.trading.entity.Account;
import com.crypto.trading.entity.Account.RiskLevel;
import com.crypto.trading.entity.User;
import com.crypto.trading.repository.AccountRepository;
import com.crypto.trading.repository.OrderRepository;
import com.crypto.trading.repository.TransactionRepository;
import com.crypto.trading.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {
   private final AccountRepository accountRepository;
   private final UserRepository userRepository;
   private final TransactionRepository transactionRepository;
   private final OrderRepository orderRepository;

   // 위험 수준별 투자 한도 비율을 정의
   private static final Map<RiskLevel, BigDecimal> RISK_LEVEL_LIMITS = Map.of(
		    RiskLevel.보수적, new BigDecimal("0.10"),           // 10%
		    RiskLevel.약간_보수적, new BigDecimal("0.15"),      // 15%
		    RiskLevel.보통, new BigDecimal("0.20"),            // 20%
		    RiskLevel.약간_공격적, new BigDecimal("0.25"),      // 25%
		    RiskLevel.공격적, new BigDecimal("0.30")           // 30%
		);

   // 계좌 생성
   @Transactional
   public AccountResponse createAccount(AccountCreateRequest request) {
       try {
           // 1. 기본 검증
           if (request.getInitialBalance() == null) {
               throw new IllegalArgumentException("초기 잔액이 필요합니다.");
           }

           // 2. 사용자 찾기
           User user = userRepository.findByUsername(request.getUserId())
               .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

           // 3. 계좌 생성
           Account account = new Account();
           account.setAccountNumber(generateAccountNumber());
           account.setUser(user);
           account.setBalance(request.getInitialBalance());

           // 4. RiskLevel 설정 (기본값 추가)
           RiskLevel riskLevel = (user.getStyle() != null) ? 
               convertStyleToRiskLevel(user.getStyle()) : 
               RiskLevel.보통;
           account.setRiskLevel(riskLevel);

           // 5. 투자 한도 계산 (null 체크 추가)
           BigDecimal balance = request.getInitialBalance();
           if (balance != null) {
               BigDecimal investmentLimit = calculateInvestmentLimit(balance, riskLevel);
               account.setInvestmentLimit(investmentLimit);
           } else {
               account.setInvestmentLimit(BigDecimal.ZERO);
           }
           
           // 6. 투자금액 초기화
           account.setInvestmentAmount(BigDecimal.ZERO);

           // 7. 저장 및 반환
           Account savedAccount = accountRepository.save(account);
           return convertToDto(savedAccount);

       } catch (Exception e) {
           throw new RuntimeException("계좌 생성 중 오류 발생: " + e.getMessage());
       }
   }
   
   
   
// 사용자 스타일을 RiskLevel로 변환하는 메서드 추가
   public RiskLevel convertStyleToRiskLevel(String style) {
	    if (style == null) return RiskLevel.보수적;
	    
	    return switch (style) {
	        case "공격적" -> RiskLevel.공격적;
	        case "약간 공격적" -> RiskLevel.약간_공격적;
	        case "보통" -> RiskLevel.보통;
	        case "약간 보수적" -> RiskLevel.약간_보수적;
	        default -> RiskLevel.보수적;
	    };
	}

   // 특정 계좌 조회
   public AccountResponse getAccount(Long accountId) {
       try {
           Account account = findAccountById(accountId);
           return convertToDto(account);
       } catch (EntityNotFoundException e) {
           throw new EntityNotFoundException("계좌를 찾을 수 없습니다: " + accountId);
       }
   }

   // 사용자의 모든 계좌 조회
   public List<AccountResponse> getAccountsByUserId(String userId) {
       try {
           List<Account> accounts = accountRepository.findByUserId(userId);
           return accounts.stream()
                   .map(this::convertToDto)
                   .collect(Collectors.toList());
       } catch (Exception e) {
           throw new RuntimeException("사용자 계좌 조회 중 오류 발생: " + e.getMessage());
       }
   }
   
   @Transactional
   public AccountResponse updateOrCreateAccount(AccountCreateRequest request) {
       User user = userRepository.findByUsername(request.getUserId())
           .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

       // 기존 계좌 찾기
       Account account = accountRepository.findByUser(user)
           .orElseGet(() -> {
               // 계좌가 없으면 새로 생성
               Account newAccount = new Account();
               newAccount.setUser(user);
               newAccount.setAccountNumber(generateAccountNumber());
               return newAccount;
           });

       // 계좌 정보 업데이트
       account.setBalance(request.getInitialBalance());
       account.setRiskLevel(request.getRiskLevel());
       
       // User의 style도 함께 업데이트 추가
       user.setStyle(request.getRiskLevel().toString());
       userRepository.save(user);
       
       // 투자 한도 계산 및 설정
       BigDecimal investmentLimit = calculateInvestmentLimit(
           request.getInitialBalance(), 
           request.getRiskLevel()
       );
       account.setInvestmentLimit(investmentLimit);

       // 저장
       Account savedAccount = accountRepository.save(account);
       return convertToDto(savedAccount);
   }

   // 계좌 잔액 수정
   @Transactional
   public void updateBalance(Long accountId, BigDecimal amount) {
       try {
           Account account = findAccountById(accountId);
           if (amount.compareTo(BigDecimal.ZERO) < 0) {
               throw new IllegalArgumentException("잔액은 0보다 작을 수 없습니다.");
           }
           account.setBalance(amount);
           
           // 잔액 변경에 따른 투자 한도와 투자금액 재계산
           BigDecimal newInvestmentLimit = calculateInvestmentLimit(
               amount,
               account.getRiskLevel()
           );
           account.setInvestmentLimit(newInvestmentLimit);
           account.setInvestmentAmount(newInvestmentLimit); // 투자금액도 업데이트
       } catch (EntityNotFoundException e) {
           throw new EntityNotFoundException("계좌를 찾을 수 없습니다: " + accountId);
       } catch (Exception e) {
           throw new RuntimeException("잔액 수정 중 오류 발생: " + e.getMessage());
       }
   }

   // 위험 수준 수정
   @Transactional
   public void updateRiskLevel(Long accountId, RiskLevel riskLevel) {
       try {
           Account account = findAccountById(accountId);
           if (riskLevel == null) {
               throw new IllegalArgumentException("위험 수준을 지정해야 합니다.");
           }
           account.setRiskLevel(riskLevel);
           
           // User의 style도 함께 업데이트
           User user = account.getUser();
           user.setStyle(riskLevel.toString());
           userRepository.save(user);
           
           // 투자 한도 재계산
           BigDecimal newInvestmentLimit = calculateInvestmentLimit(
               account.getBalance(), 
               riskLevel
           );
           account.setInvestmentLimit(newInvestmentLimit);
           account.setInvestmentAmount(newInvestmentLimit);
       } catch (EntityNotFoundException e) {
           throw new EntityNotFoundException("계좌를 찾을 수 없습니다: " + accountId);
       } catch (Exception e) {
           throw new RuntimeException("위험 수준 수정 중 오류 발생: " + e.getMessage());
       }
   }
   
   @Transactional
   public void resetTransactions(String username) {
       try {
           // 사용자 존재 여부 확인
           User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

           // 거래 내역 삭제
           transactionRepository.deleteByAccount_User_Username(username);
           
           // 주문 내역 삭제
           orderRepository.deleteByAccount_User_Username(username);

           // 계좌의 투자금액 초기화
           List<Account> accounts = accountRepository.findByUserId(username);
           for (Account account : accounts) {
               account.setInvestmentAmount(BigDecimal.ZERO);
               accountRepository.save(account);
           }
       } catch (Exception e) {
           throw new RuntimeException("거래 내역 초기화 중 오류 발생: " + e.getMessage());
       }
   }

   // 투자 한도 계산
   private BigDecimal calculateInvestmentLimit(BigDecimal balance, RiskLevel riskLevel) {
       BigDecimal limitRatio = RISK_LEVEL_LIMITS.get(riskLevel);
       return balance.multiply(limitRatio).setScale(2, RoundingMode.HALF_UP);
   }

   // 계좌번호 생성
   private String generateAccountNumber() {
       return UUID.randomUUID().toString().substring(0, 10);
   }

   // 계좌 ID로 계좌 찾기
   private Account findAccountById(Long accountId) {
       return accountRepository.findById(accountId)
               .orElseThrow(() -> new EntityNotFoundException("계좌를 찾을 수 없습니다: " + accountId));
   }

   // Entity를 DTO로 변환
   // DTO 변환 메서드 수정
   private AccountResponse convertToDto(Account account) {
	    return AccountResponse.builder()
	            .id(account.getId())
	            .accountNumber(account.getAccountNumber())
	            .userId(account.getUser().getUsername())
	            .balance(account.getBalance())
	            .investmentLimit(account.getInvestmentLimit())
	            .investmentAmount(account.getInvestmentAmount())
	            .riskLevel(account.getRiskLevel().toString())  // toString() 추가
	            .createdAt(account.getCreatedAt())
	            .updatedAt(account.getUpdatedAt())
	            .build();
	}
}