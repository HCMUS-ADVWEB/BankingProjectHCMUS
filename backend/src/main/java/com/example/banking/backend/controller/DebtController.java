package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.CreateDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.DebtReminderListsResponse;
import com.example.banking.backend.dto.response.debt.PayDebtResponse;
import com.example.banking.backend.model.type.DebtStatusType;
import com.example.banking.backend.service.DebtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    @Operation(tags = "🧧 Debt"
            , summary = "[CUSTOMER] Create a debt reminder"
            , description = "Customers create a debt reminder and send it to the debtor")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("")
    public ResponseEntity<ApiResponse<CreateDebtReminderResponse>> createDebtReminder(
            @RequestBody CreateDebtReminderRequest request) {
        // Use a default UUID for creatorId

        // Call the service to create the debt reminder
        ApiResponse<CreateDebtReminderResponse> response = debtService.createDebtReminder(request);

        // Return the response
        return ResponseEntity.ok(response);
    }

    @Operation(tags = "🧧 Debt"
            , summary = "[CUSTOMER] Cancel a debt reminder"
            , description = "Customers cancel an existing debt reminder")
    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/{reminderId}")
    public ResponseEntity<ApiResponse<?>> cancelDebtReminder(
            @Parameter(description = "Id of the reminder that needs to be cancelled"
                    , required = true
                    , example = "ca1b8d49-ebe3-426c-adaf-130dde641fc6") @PathVariable String reminderId,
            @RequestBody CancelDebtReminderRequest request) {
        reminderId = reminderId.trim();
        UUID reminderUUID = UUID.fromString(reminderId); // Convert the string to UUID

        ApiResponse<?> response = debtService.cancelDebtReminder(reminderUUID, request);
        return ResponseEntity.ok(response);
    }

    @Operation(tags = "🧧 Debt"
            , summary = "[CUSTOMER] Request an OTP to pay a debt"
            , description = "Customers request an OTP to pay a debt")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/request-otp")
    public ResponseEntity<ApiResponse<?>> requestPayDebtOtp() {
        debtService.requestOtpForPayDebt();
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Email sent successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }

    @Operation(tags = "🧧 Debt"
            , summary = "[CUSTOMER] Pay an existing debt"
            , description = "Customers pay an existing debt")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/{reminderId}")
    public ResponseEntity<ApiResponse<PayDebtResponse>> payDebtReminder(
            @Parameter(description = "Id of the debt reminder that is about to be paid"
                    , required = true
                    , example = "ca1b8d49-ebe3-426c-adaf-130dde641fc6") @PathVariable String reminderId,
            @Valid @RequestBody PayDebtRequest request) {
        ApiResponse<PayDebtResponse> response = debtService.payDebtReminder(UUID.fromString(reminderId), request);

        return ResponseEntity.ok(response);
    }

    @Operation(tags = "🧧 Debt"
            , summary = "[CUSTOMER] Get all current account's debt reminders"
            , description = "Customers get all of their debt reminders")
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("")
    public ResponseEntity<ApiResponse<DebtReminderListsResponse>> getDebtReminderLists(
            @Parameter(description = "Debt's status") @RequestParam(required = false) String status,
            @Parameter(description = "Limit per page") @RequestParam(defaultValue = "10") int limit,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "1") int page
    ) {
        DebtStatusType debtStatusType = status != null ? DebtStatusType.fromValue(status) : null;
        ApiResponse<DebtReminderListsResponse> response = debtService.getDebtReminderLists(debtStatusType, limit, page);
        return ResponseEntity.ok(response);
    }
}
