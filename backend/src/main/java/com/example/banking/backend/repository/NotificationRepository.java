package com.example.banking.backend.repository;

import com.example.banking.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Query("SELECT n FROM Notification n WHERE n.userId.id = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findAllByUserId(UUID userId, Pageable pageable);
}
