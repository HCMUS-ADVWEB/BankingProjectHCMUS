package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.AddRecipientRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequestExternal;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/internal")
    public ResponseEntity<ApiResponse<TransferResult>> internalTransfer(
            @Valid @RequestBody TransferRequest request) {
        try {
            TransferResult result = transactionService.internalTransfer(request);

            return ResponseEntity.ok(ApiResponse.<TransferResult>builder()
                    .status(HttpStatus.OK.value())
                    .message("Internal transfer initiated successfully")
                    .data(result)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<TransferResult>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Internal transfer failed: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/external")
    public ResponseEntity<ApiResponse<TransferResult>> externalTransfer(
            @Valid @RequestBody TransferRequestExternal request) {
        try {
            TransferResult result = transactionService.externalTransfer(request);

            if (result.isSuccess()) {
                return ResponseEntity.ok(ApiResponse.<TransferResult>builder()
                        .status(HttpStatus.OK.value())
                        .message("External transfer initiated successfully")
                        .data(result)
                        .build());
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.<TransferResult>builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message(result.getErrorMessage())
                        .data(result)
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<TransferResult>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("External transfer failed: " + e.getMessage())
                            .build());
        }
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        try {
            transactionService.verifyTransferOtp(request);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("OTP verified successfully")
                    .data("Transfer completed")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message("OTP verification failed: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getTransactionHistory(
            @RequestParam UUID accountId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page) {
        try {
            List<TransactionDto> transactions = transactionService.getTransactionHistory(accountId, limit, page);

            return ResponseEntity.ok(ApiResponse.<List<TransactionDto>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Transaction history retrieved successfully")
                    .data(transactions)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<List<TransactionDto>>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<TransactionDto>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to retrieve transaction history: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/recipients")
    public ResponseEntity<ApiResponse<List<RecipientDtoResponse>>> getRecipients(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page) {
        try {
            List<RecipientDtoResponse> recipients = transactionService.getRecipients(limit, page);

            return ResponseEntity.ok(ApiResponse.<List<RecipientDtoResponse>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipients retrieved successfully")
                    .data(recipients)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<List<RecipientDtoResponse>>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<RecipientDtoResponse>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to retrieve recipients: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/recipients")
    public ResponseEntity<ApiResponse<String>> addRecipient(
            @Valid @RequestBody AddRecipientRequest request) {
        try {
            transactionService.addRecipient(request);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.CREATED.value())
                            .message("Recipient added successfully")
                            .data("Recipient created")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to add recipient: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/recipients/{recipientId}")
    public ResponseEntity<ApiResponse<String>> updateRecipient(
            @PathVariable UUID recipientId,
            @Valid @RequestBody AddRecipientRequest request) {
        try {
            transactionService.updateRecipient(recipientId, request);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipient updated successfully")
                    .data("Recipient information updated")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to update recipient: " + e.getMessage())
                            .build());
        }
    }


    @DeleteMapping("/recipients")
    public ResponseEntity<ApiResponse<String>> deleteRecipient(
            @RequestParam String recipientFullName,
            @RequestParam String recipientAccountNumber,
            @RequestParam String bankName) {
        try {
            transactionService.deleteRecipient(recipientFullName, recipientAccountNumber, bankName);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipient deleted successfully")
                    .data("Recipient removed")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to delete recipient: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/verify-recipient")
    public ResponseEntity<ApiResponse<Boolean>> verifyRecipient(
            @RequestParam String accountNumber,
            @RequestParam UUID bankId) {
        try {
            boolean isValid = transactionService.verifyRecipient(accountNumber, bankId);

            return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipient verification completed")
                    .data(isValid)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<Boolean>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .data(false)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Boolean>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Recipient verification failed: " + e.getMessage())
                            .data(false)
                            .build());
        }
    }

    @GetMapping("/bank-transactions")
    public ResponseEntity<ApiResponse<?>> getBankTransactions(
            @RequestParam(required = false) UUID bankId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        try {
            List<TransactionDto> transactions = transactionService.getBankTransactions(startDate, endDate, limit, page);

            return ResponseEntity.ok(ApiResponse.<List<TransactionDto>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Bank transactions retrieved successfully")
                    .data(transactions)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<List<TransactionDto>>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<TransactionDto>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to retrieve bank transactions: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/bank-transactions/statistics")
    public ResponseEntity<ApiResponse<?>> getBankTransactionStats(
            @RequestParam(required = false) UUID bankId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        try {
            BankTransactionStatsDto stats = transactionService.getBankTransactionStats(bankId, startDate, endDate);

            return ResponseEntity.ok(ApiResponse.<BankTransactionStatsDto>builder()
                    .status(HttpStatus.OK.value())
                    .message("Bank transaction statistics retrieved successfully")
                    .data(stats)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<BankTransactionStatsDto>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<BankTransactionStatsDto>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to retrieve bank statistics: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/external/{bankId}/{accountNumber}")
    public ResponseEntity<ApiResponse<?>> getExternalAccountInfo(@PathVariable String accountNumber, @PathVariable UUID bankId) {
        try {
            AccountDto accountInfo = transactionService.getExternalAccountInfo(accountNumber, bankId);

            return ResponseEntity.ok(ApiResponse.<AccountDto>builder()
                    .status(HttpStatus.OK.value())
                    .message("External account information retrieved successfully")
                    .data(accountInfo)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<AccountDto>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<AccountDto>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to retrieve account information: " + e.getMessage())
                            .build());
        }
    }


    @PostMapping("/external/deposit")
    public ResponseEntity<ApiResponse<String>> externalDeposit(
            @Valid @RequestBody ExternalDepositRequest request) {
        try {
            transactionService.externalDeposit(request);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("External deposit initiated successfully")
                    .data("Deposit processed")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("External deposit failed: " + e.getMessage())
                            .build());
        }
    }
}
