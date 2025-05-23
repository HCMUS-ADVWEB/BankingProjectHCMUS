package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.DepositRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    // private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAccounts() {
        return null;
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<?>> getAccountDetails(@PathVariable UUID accountId) {
        return null;
    }

    @PostMapping("/{accountId}/deposit")
    public ResponseEntity<ApiResponse<Void>> deposit(@PathVariable UUID accountId, @RequestBody DepositRequest request) {
        return null;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createCustomerAccount(@RequestBody CreateCustomerRequest request) {
        return null;
    }
}
