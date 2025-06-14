package com.example.banking.backend.dto.response.notification;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
public class NotificationResponse {
    private UUID id;          // Notification ID
    private String title;     // Notification title
    private String content;   // Notification content
    private Instant createdAt; // Timestamp when the notification was created
    private boolean read;     // Whether the notification has been read
}
