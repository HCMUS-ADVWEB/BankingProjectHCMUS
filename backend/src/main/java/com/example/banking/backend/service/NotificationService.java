package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.notification.DebtReminderNotificationRequest;
import com.example.banking.backend.dto.request.notification.SendOtpRequest;
import com.example.banking.backend.dto.request.notification.TransactionReceiptRequest;

import java.util.UUID;

public interface NotificationService {

    void getNotifications(int limit, int page);

    void markNotificationAsRead(UUID notificationId);

    void deleteNotification(UUID notificationId);

    void sendOtp(SendOtpRequest request);

    void sendTransactionReceipt(TransactionReceiptRequest request);

    void sendDebtReminderNotification(DebtReminderNotificationRequest request);
}
