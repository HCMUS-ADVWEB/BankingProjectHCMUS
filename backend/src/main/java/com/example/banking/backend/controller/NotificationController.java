package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.notification.AddNotificationRequest;
import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.model.Notification;
import com.example.banking.backend.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(tags = "🔔 Notification"
            , summary = "[CUSTOMER] Get all notifications"
            , description = "Customers get all of their notifications")
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @Parameter(description = "Limit per page") @RequestParam(defaultValue = "10") int limit,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "1") int page
    ) {
        List<NotificationResponse> notifications = notificationService.getAllNotifications(limit, page);

        return ResponseEntity.ok(ApiResponse.<List<NotificationResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Notifications retrieved successfully")
                .data(notifications)
                .build());
    }

    @Operation(tags = "🔔 Notification"
            , summary = "[CUSTOMER] Read all notifications"
            , description = "Customers mark all of their notifications as read")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsAsRead() {
        notificationService.markAllNotificationsAsRead();

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("All notifications marked as read")
                .build());
    }

    @Operation(tags = "🔔 Notification"
            , summary = "[CUSTOMER] Read a notification"
            , description = "Customers mark a notification as read")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/read/{id}")
    public ResponseEntity<ApiResponse<Void>> markNotificationAsRead(
            @Parameter(description = "Notification's id"
                    , example = "bb21f613-f49f-4d65-8327-1b249afff2d4")
            @PathVariable("id") UUID notificationId) {
        notificationService.markNotificationAsRead(notificationId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Notification marked as read")
                .build());
    }

    @Operation(tags = "🔔 Notification"
            , summary = "[PROTECTED] Add a new notification"
            , description = "Add a new notification")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Notification>> addNotification(
            @Validated @RequestBody AddNotificationRequest request) {
        Notification notification = notificationService.addNotification(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<Notification>builder()
                        .status(HttpStatus.CREATED.value())
                        .message("Notification created successfully")
                        .data(notification)
                        .build()
        );
    }
}
