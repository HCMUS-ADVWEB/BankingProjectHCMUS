package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.GetAccountTransactionsRequest;
import com.example.banking.backend.dto.request.auth.ChangePasswordRequest;
import com.example.banking.backend.dto.response.account.AccountInfoResult;
import com.example.banking.backend.dto.response.account.CreateCustomerAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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

    @Operation(tags = "Account"
            , summary = "[CUSTOMER] Get current account's information"
            , description = "Customers get their own account number and balance")
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-account")
    public ResponseEntity<ApiResponse<GetAccountResponse>> getAccount() {
        UUID userId = CustomContextHolder.getCurrentUserId();
        ApiResponse<GetAccountResponse> apiResponse = accountService.getAccount(userId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @Operation(tags = "Account"
            , summary = "[EMPLOYEE] Get all transactions of an account"
            , description = "Employee gets one customer's transactions")
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

    @Operation(tags = "Account"
            , summary = "[EMPLOYEE] Create a customer account"
            , description = "Employee creates a customer account")
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


    @Operation(tags = "Account"
            , summary = "[CUSTOMER] Get current account transaction history"
            , description = "Customers get their own transaction history")
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer/transactions")
    public ResponseEntity<ApiResponse<GetAccountTransactionsResponse>> getCustomerTransaction(
            @Parameter(description = "Limit per page")@RequestParam(required = false, defaultValue = "10") Integer limit,
            @Parameter(description = "Page number")@RequestParam(required = false, defaultValue = "1") Integer pn,
            @Parameter(description = "Transaction type")@RequestParam(required = false) TransactionType type) {
        ApiResponse<GetAccountTransactionsResponse> apiResponse = accountService.getCustomerTransactions(limit, pn, type);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }




    @Operation(tags = "Account"
            , summary = "[CUSTOMER] Get an account's information"
            , description = "Customers get other account's information (to transfer money)"
            , requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = "{ \"accountNumber\": \"5873906278933357\", \"bankCode\": null }"
                            )
                    ))
    )
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
