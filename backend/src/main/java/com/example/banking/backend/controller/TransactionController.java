package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.AddRecipientRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    // private final TransactionService transactionService;

    @PostMapping("/internal")
    public ResponseEntity<ApiResponse<?>> internalTransfer(@RequestBody TransferRequest request) {
        return null;
    }

    @PostMapping("/external")
    public ResponseEntity<ApiResponse<?>> externalTransfer(@RequestBody TransferRequest request) {
        return null;
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyTransferOtp(@RequestBody VerifyOtpRequest request) {
        return null;
    }

    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<ApiResponse<?>> getTransactionHistory(
            @PathVariable UUID accountId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        return null;
    }

    @GetMapping("/recipients")
    public ResponseEntity<ApiResponse<?>> getRecipients(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        return null;
    }

    @PostMapping("/recipients")
    public ResponseEntity<ApiResponse<?>> addRecipient(@RequestBody AddRecipientRequest request) {
        return null;
    }

    @PutMapping("/recipients/{recipientId}")
    public ResponseEntity<ApiResponse<?>> updateRecipient(@PathVariable UUID recipientId, @RequestBody AddRecipientRequest request) {
        return null;
    }

    @DeleteMapping("/recipients/{recipientId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecipient(@PathVariable UUID recipientId) {
        return null;
    }

    @GetMapping("/recipients/verify/{accountNumber}")
    public ResponseEntity<ApiResponse<?>> verifyRecipient(
            @PathVariable String accountNumber,
            @RequestParam(required = false) UUID bankId
    ) {
        return null;
    }

    @GetMapping("/bank-transactions")
    public ResponseEntity<ApiResponse<?>> getBankTransactions(
            @RequestParam(required = false) UUID bankId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        return null;
    }

    @GetMapping("/bank-transactions/statistics")
    public ResponseEntity<ApiResponse<?>> getBankTransactionStats(
            @RequestParam(required = false) UUID bankId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        return null;
    }

    @GetMapping("/external/{accountNumber}")
    public ResponseEntity<ApiResponse<?>> getExternalAccountInfo(@PathVariable String accountNumber) {
        return null;
    }

    @PostMapping("/external/deposit")
    public ResponseEntity<ApiResponse<Void>> externalDeposit(@RequestBody ExternalDepositRequest request) {
        return null;
    }
}
