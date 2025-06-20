package com.example.banking.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.GetDebtPaymentOtpRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.CreateDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.model.type.DebtStatusType;
import com.example.banking.backend.service.DebtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<GetDebtReminderResponse>>> getDebtReminders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        DebtStatusType debtStatusType = status != null ? DebtStatusType.fromValue(status) : null;
        ApiResponse<List<GetDebtReminderResponse>> response = debtService.getDebtReminders(debtStatusType, limit, page);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/reminders")
    public ResponseEntity<ApiResponse<CreateDebtReminderResponse>> createDebtReminder(
            @RequestBody CreateDebtReminderRequest request) {
        // Use a default UUID for creatorId

        // Call the service to create the debt reminder
        ApiResponse<CreateDebtReminderResponse> response = debtService.createDebtReminder(request);

        // Return the response
        return ResponseEntity.ok(response);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/{reminderId}")
    public ResponseEntity<ApiResponse<Void>> cancelDebtReminder(@PathVariable String reminderId, @RequestBody CancelDebtReminderRequest request) {
        try {
            // Trim and validate the UUID string
            reminderId = reminderId.trim();
            UUID reminderUUID = UUID.fromString(reminderId); // Convert the string to UUID

            ApiResponse<Void> response = debtService.cancelDebtReminder(reminderUUID, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Handle invalid UUID format
            ApiResponse<Void> errorResponse = ApiResponse.<Void>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Invalid UUID format: " + reminderId)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
        
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/request-otp")
        public ResponseEntity<ApiResponse<?>> forgotPassword(@Valid @RequestBody GetDebtPaymentOtpRequest request) {
        debtService.requestOtpForPayDebt(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Email sent successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }
    
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/{reminderId}/pay")
    public ResponseEntity<ApiResponse<String>> payDebtReminder(
            @PathVariable String reminderId,
            @Valid @RequestBody PayDebtRequest request) {
        try {
            debtService.payDebtReminder(UUID.fromString(reminderId), request);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Debt reminder paid successfully")
                    .data("Payment processed")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to pay debt reminder: " + e.getMessage())
                            .build());
        }
    }

}
