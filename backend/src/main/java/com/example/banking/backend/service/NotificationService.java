package com.example.banking.backend.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.example.banking.backend.dto.request.notification.AddNotificationRequest;
import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.model.Notification;
public interface NotificationService {
    Page<NotificationResponse> getAllNotifications(int limit, int page);

    void markAllNotificationsAsRead();
    
    void markNotificationAsRead(UUID notificationId);

    Notification addNotification(AddNotificationRequest request);

    /**
     * Send a notification to a specific user via WebSocket
     * @param userId The ID of the user to send the notification to
     * @param title The title of the notification
     * @param content The content of the notification
     */
    void sendWebSocketNotification(UUID userId, String title, String content);
}
