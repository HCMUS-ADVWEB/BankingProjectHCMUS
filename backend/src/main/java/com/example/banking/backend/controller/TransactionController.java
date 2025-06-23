package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.request.transaction.TransferExternalRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.response.account.AccountDto;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.service.TransactionService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@SecurityRequirement(name = "bearerAuth")
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
            @Valid @RequestBody TransferExternalRequest request) throws Exception {
        TransferResult result = transactionService.externalTransfer(request);
        return ResponseEntity.ok(ApiResponse.<TransferResult>builder()
                .status(HttpStatus.OK.value())
                .message("External transfer completed successfully")
                .data(result)
                .build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bank-transactions")
    public ResponseEntity<ApiResponse<?>> getBankTransactions(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {

        List<TransactionDto> transactions = transactionService.getBankTransactions(startDate, endDate, limit, page);

        return ResponseEntity.ok(ApiResponse.<List<TransactionDto>>builder()
                .status(HttpStatus.OK.value())
                .message("Bank transactions retrieved successfully")
                .data(transactions)
                .build());

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bank-transactions/statistics")
    public ResponseEntity<ApiResponse<?>> getBankTransactionStats(
            @RequestParam(required = false) String bankId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {

        BankTransactionStatsDto stats = transactionService.getBankTransactionStats(UUID.fromString(bankId), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.<BankTransactionStatsDto>builder()
                .status(HttpStatus.OK.value())
                .message("Bank transaction statistics retrieved successfully")
                .data(stats)
                .build());
    }


    @PostMapping("/external/deposit")
    public ResponseEntity<ApiResponse<DepositResult>> receiveInterbankTransfer(
            @RequestBody InterbankTransferRequest request,
            @RequestHeader("Bank-Code") String sourceBankCode,
            @RequestHeader("X-Timestamp") String timestamp,
            @RequestHeader("X-Request-Hash") String receivedHmac,
            @RequestHeader("X-Signature") String signature) throws Exception {

        DepositResult depositResult = transactionService.externalDeposit(request, sourceBankCode,
                timestamp, receivedHmac, signature);

        return ResponseEntity.ok(ApiResponse.<DepositResult>builder()
                .status(HttpStatus.OK.value())
                .message("External deposit initiated successfully")
                .data(depositResult)
                .build());

    }




}
