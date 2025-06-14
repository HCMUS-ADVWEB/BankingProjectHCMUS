package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.notification.DebtReminderNotificationRequest;
import com.example.banking.backend.dto.request.notification.SendOtpRequest;
import com.example.banking.backend.dto.request.notification.TransactionReceiptRequest;
import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.service.NotificationService;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        UUID userId = CustomContextHolder.getCurrentUserId(); // Get the current user ID
        Page<NotificationResponse> notifications = notificationService.getAllNotifications(limit, page);

        return ResponseEntity.ok(ApiResponse.<Page<NotificationResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Notifications retrieved successfully")
                .data(notifications)
                .build());
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationAsRead(@PathVariable UUID notificationId) {
        return null;
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable UUID notificationId) {
        return null;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@RequestBody SendOtpRequest request) {
        return null;
    }

    @PostMapping("/send-transaction-receipt")
    public ResponseEntity<ApiResponse<Void>> sendTransactionReceipt(@RequestBody TransactionReceiptRequest request) {
        return null;
    }

    @PostMapping("/debt-reminder-notification")
    public ResponseEntity<ApiResponse<Void>> sendDebtReminderNotification(@RequestBody DebtReminderNotificationRequest request) {
        return null;
    }
}
