package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.DepositRequest;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

//    @PostMapping("/create")
//    public ResponseEntity<ApiResponse<?>> createCustomerAccount(@RequestBody CreateCustomerRequest request) {
//        return null;
//    }

    @GetMapping("/customer/{accountId}")
    public ResponseEntity<ApiResponse<GetAccountResponse>> getAccount(@PathVariable UUID accountId) {
        ApiResponse<GetAccountResponse> apiResponse = accountService.getAccount(accountId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/employee/{accountId}")
    public ResponseEntity<ApiResponse<GetAccountTransactionsResponse>> getAccountTransactions(
            @PathVariable UUID accountId,
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer pn,
            @RequestParam(required = false) TransactionType type
    ) {
        ApiResponse<GetAccountTransactionsResponse> apiResponse = accountService.getAccountTransactions(accountId, limit, pn, type);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
