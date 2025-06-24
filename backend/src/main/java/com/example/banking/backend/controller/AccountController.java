package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.*;
import com.example.banking.backend.dto.request.auth.ChangePasswordRequest;
import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.response.account.*;
import com.example.banking.backend.dto.response.transaction.DepositResult;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.AccountService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@SecurityRequirement(name = "bearerAuth")
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
    @PostMapping("/get-account-transactions")
    public ResponseEntity<ApiResponse<GetAccountTransactionsResponse>> getAccountTransactions(
            @RequestBody GetAccountTransactionsRequest request,
            @Parameter(description = "Limit per page") @RequestParam(required = false, defaultValue = "10") Integer limit,
            @Parameter(description = "Page number")  @RequestParam(required = false, defaultValue = "1") Integer pn,
            @Parameter(description = "Transaction type") @RequestParam(required = false) TransactionType type
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

    /*@PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/recharge")
    public ResponseEntity<ApiResponse> rechargeCustomer(@RequestBody RechargeAccountRequest request) {
        ApiResponse apiResponse = accountService.rechargeAccount(request);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }*/

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer/transactions")
    public ResponseEntity<ApiResponse<GetAccountTransactionsResponse>> getCustomerTransaction(
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer pn,
            @RequestParam(required = false) TransactionType type) {
        ApiResponse<GetAccountTransactionsResponse> apiResponse = accountService.getCustomerTransactions(limit, pn, type);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
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



}
