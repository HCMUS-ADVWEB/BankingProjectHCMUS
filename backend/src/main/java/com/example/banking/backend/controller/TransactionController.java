package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.*;
import com.example.banking.backend.dto.response.account.AccountDto;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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

    @Operation(tags = "Transaction"
            , summary = "[CUSTOMER] Make an internal transaction"
            , description = "Customers transfer money to an internal account")
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

    @Operation(tags = "Transaction"
            , summary = "[CUSTOMER] Make an external transaction"
            , description = "Customers transfer money to an external account")
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

    @Operation(tags = "Transaction"
            , summary = "[ADMIN] Get all banks' transactions in a period of time"
            , description = "Admin get all banks' transactions from start date to end date")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bank-transactions")
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getBankTransactions(
            @Parameter(description = "Get transactions from this date")@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String startDate,
            @Parameter(description = "Get transactions to this date")@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String endDate,
            @Parameter(description = "Limit per page")@RequestParam(defaultValue = "10") int limit,
            @Parameter(description = "Page number")@RequestParam(defaultValue = "1") int page
    ) {
        // Fix: Sử dụng dấu gạch dưới thay vì dấu cách
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDateTime defaultEndDate = now.withHour(23).withMinute(59).withSecond(59);
        LocalDateTime defaultStartDate = now.minusDays(10).withHour(0).withMinute(0).withSecond(0);

        if (startDate == null) {
            startDate = defaultStartDate.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
        if (endDate == null) {
            endDate = defaultEndDate.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }

        List<TransactionDto> transactions = transactionService.getBankTransactions(startDate, endDate, limit, page);

        return ResponseEntity.ok(ApiResponse.<List<TransactionDto>>builder()
                .status(HttpStatus.OK.value())
                .message("Bank transactions retrieved successfully")
                .data(transactions)
                .build());
    }

    @Operation(tags = "Transaction"
            , summary = "[ADMIN] Get all banks' transaction statistics in a period of time"
            , description = "Admin get all banks' transaction statistics from start date to end date")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bank-transactions/statistics")
    public ResponseEntity<ApiResponse<BankTransactionStatsDto>> getBankTransactionStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        if (startDate == null || startDate.trim().isEmpty()) {
            startDate = now.minusDays(30).format(DateTimeFormatter.ISO_LOCAL_DATE); // 30 ngày trước
        }

        if (endDate == null || endDate.trim().isEmpty()) {
            endDate = now.format(DateTimeFormatter.ISO_LOCAL_DATE); // Hôm nay
        }

        try {
            BankTransactionStatsDto stats = transactionService.getBankTransactionStats(startDate, endDate);
            return ResponseEntity.ok(ApiResponse.<BankTransactionStatsDto>builder()
                    .status(HttpStatus.OK.value())
                    .message("Bank transaction statistics retrieved successfully")
                    .data(stats)
                    .build());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while retrieving statistics");
        }

    }

    @Operation(tags = "Transaction"
            , summary = "[EMPLOYEE] Recharge money to an internal account"
            , description = "Employees recharge an amount of money to an internal account")

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/internal/deposit")
    public ResponseEntity<ApiResponse<InternalDepositResult>> internalDeposit(
            @Valid @RequestBody InternalDeposit request) {
        InternalDepositResult result = transactionService.internalDeposit(request);
        return ResponseEntity.ok(ApiResponse.<InternalDepositResult>builder()
                .status(HttpStatus.OK.value())
                .message("Internal deposit initiated successfully")
                .data(result)
                .build());
    }


}
