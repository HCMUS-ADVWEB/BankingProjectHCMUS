package com.example.banking.backend.repository;

import com.example.banking.backend.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Query("SELECT n FROM Notification n WHERE n.userId = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findAllByUserId(UUID userId, Pageable pageable);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.userId = :userId")
    void markAllAsReadByUserId(UUID userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.id = :notificationId AND n.userId = :userId")
    void markAsRead(UUID notificationId, UUID userId);

    @Query("SELECT COUNT(n) > 0 FROM Notification n WHERE n.id = :notificationId AND n.userId = :userId")
    boolean existsByIdAndUserId(UUID notificationId, UUID userId);
}
