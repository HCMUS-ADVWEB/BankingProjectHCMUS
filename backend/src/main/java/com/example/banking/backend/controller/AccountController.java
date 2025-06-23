package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.DepositRequest;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.request.auth.ChangePasswordRequest;
import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.response.account.*;
import com.example.banking.backend.dto.response.transaction.DepositResult;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-account")
    public ResponseEntity<ApiResponse<GetAccountResponse>> getAccount() {
        UUID userId = CustomContextHolder.getCurrentUserId();
        ApiResponse<GetAccountResponse> apiResponse = accountService.getAccount(userId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<GetAccountTransactionsResponse>> getAccountTransactions(
            @PathVariable String accountId,
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer pn,
            @RequestParam(required = false) TransactionType type
    ) {
        ApiResponse<GetAccountTransactionsResponse> apiResponse = accountService.getAccountTransactions(accountId, limit, pn, type);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CreateCustomerAccountResponse>> createCustomerAccount(@RequestBody CreateCustomerRequest request) {
        ApiResponse<CreateCustomerAccountResponse> apiResponse = accountService.createCustomerAccount(request);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/recharge")
    public ResponseEntity<ApiResponse> rechargeCustomer(@RequestBody RechargeAccountRequest request) {
        ApiResponse apiResponse = accountService.rechargeAccount(request);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer/transactions")
    public ResponseEntity<ApiResponse<GetAccountTransactionsResponse>> getCustomerTransaction(
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer pn) {
        ApiResponse apiResponse = accountService.getCustomerTransactions(limit, pn);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        accountService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Change password successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }


    @PostMapping("/account-info")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<AccountInfoResult>> getAccountInfo(@RequestBody AccountInfoRequest request) {
        return ResponseEntity.ok(ApiResponse.<AccountInfoResult>builder()
                .status(HttpStatus.OK.value())
                .message("Account info retrieved successfully")
                .data(accountService.getAccountInfo(request))
                .build());

    }

    @PostMapping("/linked-banks/accounts")
    public ResponseEntity<ApiResponse<AccountInfoResponse>> processAccountInfo(
            @RequestBody AccountInfoRequest request,
            @RequestHeader("Bank-Code") String sourceBankCode,
            @RequestHeader("X-Timestamp") String timestamp,
            @RequestHeader("X-Request-Hash") String receivedHmac,
            @RequestHeader("X-Signature") String signature) throws Exception {
        AccountInfoResponse response = accountService.processAccountInfo(request, sourceBankCode, timestamp, receivedHmac, signature);
        return ResponseEntity.ok(ApiResponse.<AccountInfoResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Account info processed successfully")
                .data(response)
                .build());
    }

}
