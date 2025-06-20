package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.DepositRequest;
import com.example.banking.backend.dto.request.account.GetAccountTransactionsRequest;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.response.account.CreateCustomerAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.AccountService;
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

//    @GetMapping("/{accountId}")
//    public ResponseEntity<ApiResponse<?>> getAccountDetails(@PathVariable UUID accountId) {
//        return null;
//    }

//    @PostMapping("/{accountId}/deposit")
//    public ResponseEntity<ApiResponse<Void>> deposit(@PathVariable UUID accountId, @RequestBody DepositRequest request) {
//        return null;
//    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/")
    public ResponseEntity<ApiResponse<GetAccountResponse>> getAccount() {
        UUID userId = CustomContextHolder.getCurrentUserId();
        ApiResponse<GetAccountResponse> apiResponse = accountService.getAccount(userId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/")
    public ResponseEntity<ApiResponse<GetAccountTransactionsResponse>> getAccountTransactions(
            @RequestBody GetAccountTransactionsRequest request,
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer pn,
            @RequestParam(required = false) TransactionType type
    ) {
        ApiResponse<GetAccountTransactionsResponse> apiResponse = accountService.getAccountTransactions(request.getAccountNumber(), limit, pn, type);
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
}
