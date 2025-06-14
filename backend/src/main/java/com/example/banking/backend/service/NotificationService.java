package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.notification.DebtReminderNotificationRequest;
import com.example.banking.backend.dto.request.notification.SendOtpRequest;
import com.example.banking.backend.dto.request.notification.TransactionReceiptRequest;
import com.example.banking.backend.dto.response.notification.NotificationResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface NotificationService {
    Page<NotificationResponse> getAllNotifications(int limit, int page);

    // void markNotificationAsRead(UUID notificationId);

    // void deleteNotification(UUID notificationId);

    // void sendOtp(SendOtpRequest request);

    // void sendTransactionReceipt(TransactionReceiptRequest request);

    // void sendDebtReminderNotification(DebtReminderNotificationRequest request);
}
