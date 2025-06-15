package com.example.banking.backend.service;

import org.springframework.data.domain.Page;

import com.example.banking.backend.dto.request.notification.AddNotificationRequest;
import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.model.Notification;
public interface NotificationService {
    Page<NotificationResponse> getAllNotifications(int limit, int page);

    void markAllNotificationsAsRead();

    Notification addNotification(AddNotificationRequest request);

    // void deleteNotification(UUID notificationId);

    // void sendOtp(SendOtpRequest request);

    // void sendTransactionReceipt(TransactionReceiptRequest request);

    // void sendDebtReminderNotification(DebtReminderNotificationRequest request);
}
