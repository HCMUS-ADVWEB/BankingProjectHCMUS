package com.example.banking.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.CreateDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.model.type.DebtStatusType;
import com.example.banking.backend.service.DebtService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

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
 
    @PostMapping("/reminders")
    public ResponseEntity<ApiResponse<CreateDebtReminderResponse>> createDebtReminder(
            @RequestBody CreateDebtReminderRequest request) {
        // Use a default UUID for creatorId
        UUID defaultCreatorId = UUID.fromString("92edbffe-d9da-44e4-873b-43843306aed4");

        // Call the service to create the debt reminder
        ApiResponse<CreateDebtReminderResponse> response = debtService.createDebtReminder(defaultCreatorId, request);

        // Return the response
        return ResponseEntity.ok(response);
    }

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

    @PostMapping("/{reminderId}/pay")
    public ResponseEntity<ApiResponse<Void>> payDebtReminder(@PathVariable String reminderId, @RequestBody PayDebtRequest request) {
        try {
            // Trim and validate the UUID string
            reminderId = reminderId.trim();
            UUID reminderUUID = UUID.fromString(reminderId); // Convert the string to UUID

            ApiResponse<Void> response = debtService.payDebtReminder(reminderUUID, request);
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
}
