package com.example.banking.backend.dto.response.notification;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@Getter
@Setter
@Schema(name = "Notification",
        description = "Return notification detail")
public class NotificationResponse {

    @Schema(description = "Notification's id",
            example = "bb21f613-f49f-4d65-8327-1b249afff2d4")
    private UUID id;          // Notification ID

    @Schema(description = "Notification's title",
            example = "New Debt Reminder")
    private String title;     // Notification title

    @Schema(description = "Notification's content",
            example = "Nguyễn Văn A has created a debt reminder for 500.00 VND with message: Tra no di")
    private String content;   // Notification content

    @Schema(description = "Notification create timestamp")
    private Instant createdAt; // Timestamp when the notification was created

    @Schema(description = "Whether user read notification",
            example = "true")
    private boolean read;     // Whether the notification has been read
}
