package com.example.banking.backend.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.banking.backend.dto.request.notification.AddNotificationRequest;
import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.model.Notification;
import com.example.banking.backend.model.User;
import com.example.banking.backend.repository.NotificationRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
        @Override
    public Notification addNotification(AddNotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setCreatedAt(Instant.now());
        notification.setRead(false);

        return notificationRepository.save(notification);
    }
    @Override
    public Page<NotificationResponse> getAllNotifications(int limit, int page) {
        User user = getCurrentUser();
        PageRequest pageable = PageRequest.of(page - 1, limit);
        Page<Notification> notifications = notificationRepository.findAllByUserId(user.getId(), pageable);

        return notifications.map(notification -> new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getCreatedAt(),
                notification.isRead()
        ));

    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead() {
            UUID userId = getCurrentUserId();
            notificationRepository.markAllAsReadByUserId(userId);

    }

    private User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private UUID getCurrentUserId() {
        return CustomContextHolder.getCurrentUserId();
    }
}
