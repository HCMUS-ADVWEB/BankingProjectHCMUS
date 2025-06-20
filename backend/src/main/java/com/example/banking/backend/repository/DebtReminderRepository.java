package com.example.banking.backend.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.banking.backend.model.DebtReminder;
import com.example.banking.backend.model.type.DebtStatusType;

public interface DebtReminderRepository extends JpaRepository<DebtReminder, UUID> {
    Page<DebtReminder> findAll(Pageable pageable);
    Page<DebtReminder> findByStatus(DebtStatusType status, Pageable pageable); // Use DebtStatusType instead of String
}