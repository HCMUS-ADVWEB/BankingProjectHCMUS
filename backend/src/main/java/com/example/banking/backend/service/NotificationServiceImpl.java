package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.notification.AddNotificationRequest;
import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.model.Notification;
import com.example.banking.backend.model.User;
import com.example.banking.backend.repository.NotificationRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public Notification addNotification(AddNotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setCreatedAt(Instant.now());
        notification.setRead(false);
        notification = notificationRepository.save(notification);

        System.out.println("\n=== Sending Real-time Notification ===");
        System.out.println("User ID: " + request.getUserId());

        NotificationResponse response = new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getCreatedAt(),
                notification.isRead()
        );

        System.out.printf(
                """
                        Notification details:
                          id=%s
                          title=%s
                          content=%s
                          createdAt=%s
                          read=%s
                        %n""", response.getId(),
        response.getTitle(),
        response.getContent(),
        response.getCreatedAt(),
        response.isRead()
);

        try {            // Send to user-specific queue using UUID as the user identifier
            UUID userId = request.getUserId();
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    response
            );
            System.out.println("\n=== WebSocket Message Sent ===");
            System.out.println("Destination details:");
            System.out.println("  User UUID: " + userId);
            System.out.println("  Spring destination: /user/" + userId + "/queue/notifications");
            System.out.println("  Message type: " + response.getClass().getSimpleName());
            System.out.println("  Message ID: " + response.getId());
            System.out.println("================================\n");
        } catch (Exception e) {
            System.err.println("\n❌ Error sending WebSocket notification:");
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Stack trace:");
            e.printStackTrace();
            System.err.println();
        }

        return notification;
    }

    @Override
    public List<NotificationResponse> getAllNotifications(int limit, int page) {
        User user = getCurrentUser();
        PageRequest pageable = PageRequest.of(page - 1, limit);
        Page<Notification> notifications = notificationRepository.findAllByUserId(user.getId(), pageable);

        return notifications.map(notification -> new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getCreatedAt(),
                notification.isRead()
        )).getContent();
    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead() {
        UUID userId = getCurrentUserId();
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Override
    @Transactional
    public void markNotificationAsRead(UUID notificationId) {
        UUID userId = getCurrentUserId();

        notificationRepository.markAsRead(notificationId, userId);
    }

    @Override
    public void sendWebSocketNotification(UUID userId, String title, String content) {
        // Create and save notification
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID());
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setCreatedAt(Instant.now());
        notification.setRead(false);

        notification = notificationRepository.save(notification);

        // Create response DTO
        NotificationResponse response = new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getCreatedAt(),
                notification.isRead()
        );

        // Send via WebSocket
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    response
            );
            System.out.println("\n=== WebSocket Notification Sent ===");
            System.out.println("User ID: " + userId);
            System.out.println("Title: " + title);
            System.out.println("Content: " + content);
            System.out.println("================================\n");
        } catch (Exception e) {
            System.err.println("\n❌ Error sending WebSocket notification:");
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();
            System.err.println();
        }
    }

    private User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private UUID getCurrentUserId() {
        return CustomContextHolder.getCurrentUserId();
    }
}
