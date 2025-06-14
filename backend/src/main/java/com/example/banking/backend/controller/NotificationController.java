package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.notification.DebtReminderNotificationRequest;
import com.example.banking.backend.dto.request.notification.SendOtpRequest;
import com.example.banking.backend.dto.request.notification.TransactionReceiptRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    // private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getNotifications(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        return null;
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationAsRead(@PathVariable String notificationId) {
        return null;
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable String notificationId) {
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
