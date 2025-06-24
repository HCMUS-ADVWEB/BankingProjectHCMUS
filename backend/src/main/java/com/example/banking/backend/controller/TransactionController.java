package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.*;
import com.example.banking.backend.dto.response.account.AccountDto;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.service.TransactionService;
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
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String endDate,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bank-transactions/statistics")
    public ResponseEntity<ApiResponse<?>> getBankTransactionStats(
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
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("An error occurred while retrieving statistics")
                            .build());
        }

    }


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
