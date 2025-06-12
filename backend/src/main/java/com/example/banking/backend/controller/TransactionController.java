package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequestExternal;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;


    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/internal")
    public ResponseEntity<ApiResponse<TransferResult>> internalTransfer(
            @Valid @RequestBody TransferRequest request) {
            TransferResult result = transactionService.internalTransfer(request);
            return ResponseEntity.ok(ApiResponse.<TransferResult>builder()
                    .status(HttpStatus.OK.value())
                    .message("Internal transfer initiated successfully")
                    .data(result)
                    .build());
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/external")
    public ResponseEntity<ApiResponse<TransferResult>> externalTransfer(
            @Valid @RequestBody TransferRequestExternal request) throws Exception {

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

    }

    @PreAuthorize("hasRole('CUSTOMER')")
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


    @GetMapping("/recipients")
    public ResponseEntity<ApiResponse<List<RecipientDtoResponse>>> getRecipients(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page) {

            List<RecipientDtoResponse> recipients = transactionService.getRecipients(limit, page);
            return ResponseEntity.ok(ApiResponse.<List<RecipientDtoResponse>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipients retrieved successfully")
                    .data(recipients)
                    .build());

    }



    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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

    /*For saved Account
    * With unsaved account, need to access api of other bank
    * */
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


    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/external/deposit")
    public ResponseEntity<ApiResponse<String>> externalDeposit(
            @Valid @RequestBody ExternalDepositRequest request) throws Exception {

            transactionService.externalDeposit(request);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("External deposit initiated successfully")
                    .data("Deposit processed")
                    .build());

    }
}
