package com.example.banking.backend.dto.request.notification;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Data
@Schema(description = "Request to add a new notification with this information")
public class AddNotificationRequest {

    @NotNull
    @Schema(description = "Id of the user that this notification belongs to",
            example = "777a845b-82de-4611-abc6-7ab71bb2497c",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID userId;

    @NotBlank
    @Schema(description = "Notification's title",
            example = "New Debt Reminder",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @NotBlank
    @Schema(description = "Notification's content",
            example = "Nguyễn Văn A has created a debt reminder for 500.00 VND with message: Tra no di",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
}