package com.example.banking.backend.dto.request.notification;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddNotificationRequest {

    @NotNull
    private UUID userId;

    @NotBlank
    private String title;

    @NotBlank
    private String content;
}