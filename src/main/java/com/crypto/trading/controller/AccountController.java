package com.crypto.trading.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.crypto.trading.dto.AccountCreateRequest;
import com.crypto.trading.dto.AccountResponse;
import com.crypto.trading.entity.Account.RiskLevel;
import com.crypto.trading.service.AccountService;

import jakarta.persistence.EntityNotFoundException;
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

    @GetMapping("/create")
    public String createAccount() {
        return "createaccount";
    }

    @GetMapping("/accounts")
    public String accountList() {
        return "accountlist";
    }

    @GetMapping("/trade")
    public String trading() {
        return "trading";
    }

    @PostMapping("/accounts")
    public ResponseEntity<AccountResponse> createAccount(@RequestBody @Valid AccountCreateRequest request) {
        log.info("계좌 생성 요청: {}", request);
        try {
            AccountResponse response = accountService.createAccount(request);
            log.info("계좌 생성 완료 - accountId: {}", response.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating account: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable("accountId") Long accountId) {
        try {
            return ResponseEntity.ok(accountService.getAccount(accountId));
        } catch (EntityNotFoundException e) {
            log.error("Account not found for ID {}: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/accounts/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(@PathVariable("userId") long userId) {
        try {
            //log.info("사용자 계좌 조회 요청 - userId: {}", userId);  // 로그 추가
            List<AccountResponse> accounts = accountService.getAccountsByUserId(userId);
            //log.info("조회된 계좌 수: {}", accounts.size());  // 로그 추가
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            log.error("Error retrieving accounts for user ID {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/accounts/{accountId}/balance")
    public ResponseEntity<Void> updateBalance(
            @PathVariable("accountId") Long accountId,
            @RequestParam(name = "amount") @DecimalMin("0.0") BigDecimal amount) {
        try {
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
            @RequestParam(name = "riskLevel") RiskLevel riskLevel) {
        try {
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
