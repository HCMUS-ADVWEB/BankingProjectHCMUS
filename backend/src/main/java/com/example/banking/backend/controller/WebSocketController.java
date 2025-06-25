package com.example.banking.backend.controller;

import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/notifications")
    public void handleNotification(@Payload NotificationResponse notification) {
        try {
            // Get current user ID
            String userId = CustomContextHolder.getCurrentUserId().toString();
            System.out.println("\n=== Sending WebSocket Notification ===");
            System.out.println("User ID: " + userId);
            System.out.println("""
                    Notification: {
                      id=%s,
                      title=%s,
                      content=%s,
                      createdAt=%s,
                      read=%s
                    }""".formatted(
                    notification.getId(),
                    notification.getTitle(),
                    notification.getContent(),
                    notification.getCreatedAt(),
                    notification.isRead()
            ));

            // Primary user-specific queue using Spring's standard format
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    notification
            );
            System.out.println("Sent to /user/" + userId + "/queue/notifications");

            // Fallback to direct queue
            messagingTemplate.convertAndSend(
                    "/queue/notifications",
                    notification
            );
            System.out.println("Sent to /queue/notifications");

            // Also try general topic as last resort
            messagingTemplate.convertAndSend(
                    "/topic/notifications",
                    notification
            );
            System.out.println("Sent to /topic/notifications");

        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @MessageMapping("/test-notification")
    public void sendTestNotification() {
        try {
            String userId = CustomContextHolder.getCurrentUserId().toString();
            System.out.println("\n=== Sending Test Notification ===");
            Instant now = Instant.now();
            NotificationResponse notification = new NotificationResponse(
                    UUID.randomUUID(),
                    "Test Notification",
                    "This is a test notification sent at: " + now,
                    now,
                    false
            );
            System.out.println("""
                    Test notification details: {
                      id=%s,
                      title=%s,
                      content=%s,
                      createdAt=%s,
                      read=%s
                    }""".formatted(
                    notification.getId(),
                    notification.getTitle(),
                    notification.getContent(),
                    notification.getCreatedAt(),
                    notification.isRead()
            ));

            // Send to all possible destinations to ensure delivery
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    notification
            );
            System.out.println("Sent to /user/" + userId + "/queue/notifications");

            messagingTemplate.convertAndSend(
                    "/queue/notifications",
                    notification
            );
            System.out.println("Sent to /queue/notifications");

            messagingTemplate.convertAndSend(
                    "/topic/notifications",
                    notification
            );
            System.out.println("Sent to /topic/notifications");

            System.out.println("=== Test Notification Sent ===\n");

        } catch (Exception e) {
            System.err.println("Error sending test notification: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
