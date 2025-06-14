package com.example.banking.backend.service;

import com.example.banking.backend.dto.response.notification.NotificationResponse;
import com.example.banking.backend.model.Notification;
import com.example.banking.backend.model.User;
import com.example.banking.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    private User getCurrentUser() {
        // Replace this with the actual logic to fetch the current user
        return new User(); // Example: returning a new User instance
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
}
