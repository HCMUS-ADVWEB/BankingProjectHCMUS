package com.example.banking.backend.repository;

import com.example.banking.backend.model.DebtReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DebtReminderRepository extends JpaRepository<DebtReminder, UUID> {
    List<DebtReminder> findAll();
}