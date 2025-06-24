package com.example.banking.backend.model;

import java.time.Instant;
import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notifications")
@Schema(name = "NewNotification",
        description = "Created notification's detail")
public class Notification {

    @Id
    @GeneratedValue
    @Column(name = "notification_id", nullable = false, updatable = false)
    @ColumnDefault("gen_random_uuid()")
    @Schema(description = "Notification id",
            example = "bb21f613-f49f-4d65-8327-1b249afff2d4")
    private UUID id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    @Schema(description = "Id of the user that this notification belongs to",
            example = "777a845b-82de-4611-abc6-7ab71bb2497c")
    private UUID userId;

    @Column(name = "title", nullable = false, length = 255)
    @Schema(description = "Notification's title",
            example = "New Debt Reminder")
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    @Schema(description = "Notification's content",
            example = "Nguyễn Văn A has created a debt reminder for 500.00 VND with message: Tra no di")
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Schema(description = "Notification create timestamp")
    private Instant createdAt;

    @Column(name = "read", nullable = false)
    @ColumnDefault("false")
    @Schema(description = "Whether user read it or not",
            example = "false")
    private boolean read;
}
