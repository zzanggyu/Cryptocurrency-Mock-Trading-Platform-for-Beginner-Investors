package com.crypto.trading.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.dto.AccountCreateRequest;
import com.crypto.trading.dto.AccountResponse;
import com.crypto.trading.dto.UserResponseDTO;
import com.crypto.trading.entity.Account.RiskLevel;
import com.crypto.trading.service.AccountService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class AccountController {

    private final AccountService accountService;

 // AccountController.java
    @PostMapping("/accounts")  // URL과 메서드는 그대로 유지
    public ResponseEntity<AccountResponse> createAccount(
        @RequestBody @Valid AccountCreateRequest request,
        HttpSession session
    ) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        log.info("계좌 생성 요청: {}", request);
        try {
            request.setUserId(user.getUsername());
            // 내부적으로는 수정 메서드 호출
            AccountResponse response = accountService.updateOrCreateAccount(request);
            log.info("계좌 생성 완료 - accountId: {}", response.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating account: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<AccountResponse> getAccount(
        @PathVariable("accountId") Long accountId,
        HttpSession session
    ) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        try {
            AccountResponse account = accountService.getAccount(accountId);
            // 계좌 소유자 검증
            if (!account.getUserId().equals(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            return ResponseEntity.ok(account);
        } catch (EntityNotFoundException e) {
            log.error("Account not found for ID {}: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/accounts/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(
        @PathVariable("userId") String userId,
        HttpSession session
    ) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // 자신의 계좌만 조회 가능하도록 검증
        if (!user.getUsername().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        try {
            log.info("사용자 계좌 조회 요청 - userId: {}", userId);
            List<AccountResponse> accounts = accountService.getAccountsByUserId(userId);
            log.info("조회된 계좌 수: {}", accounts.size());
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            log.error("Error retrieving accounts for user ID {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/accounts/{accountId}/balance")
    public ResponseEntity<Void> updateBalance(
        @PathVariable("accountId") Long accountId,
        @RequestParam(name = "amount") @DecimalMin("0.0") BigDecimal amount,
        HttpSession session
    ) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // 계좌 소유자 검증
            AccountResponse account = accountService.getAccount(accountId);
            if (!account.getUserId().equals(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            accountService.updateBalance(accountId, amount);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            log.error("Account not found for balance update, ID {}: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            log.error("Invalid balance update for account ID {}: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/accounts/{accountId}/risk-level")
    public ResponseEntity<Void> updateRiskLevel(
        @PathVariable("accountId") Long accountId,
        @RequestParam(name = "riskLevel") RiskLevel riskLevel,
        HttpSession session
    ) {
        UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // 계좌 소유자 검증
            AccountResponse account = accountService.getAccount(accountId);
            if (!account.getUserId().equals(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            accountService.updateRiskLevel(accountId, riskLevel);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            log.error("Account not found for risk level update, ID {}: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            log.error("Invalid risk level update for account ID {}: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PostMapping("/accounts/reset") 
    public ResponseEntity<?> resetTransactions(HttpSession session) {
        // 로그 추가
        log.info("Reset transactions method called");
        
        try {
            UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
            if (user == null) {
                log.warn("Unauthorized reset attempt");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }

            log.info("Resetting transactions for user: {}", user.getUsername());
            accountService.resetTransactions(user.getUsername());
            return ResponseEntity.ok().body("거래 내역이 초기화되었습니다.");
        } catch (Exception e) {
            log.error("Reset transactions error", e);
            return ResponseEntity.badRequest().body("거래 내역 초기화 중 오류가 발생했습니다.");
        }
    }
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException e) {
        log.error("Entity not found: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception e) {
        log.error("Unexpected server error: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("서버 오류가 발생했습니다: " + e.getMessage());
    }
}