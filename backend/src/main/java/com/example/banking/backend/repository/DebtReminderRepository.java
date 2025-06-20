package com.example.banking.backend.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.banking.backend.model.DebtReminder;
import com.example.banking.backend.model.type.DebtStatusType;

public interface DebtReminderRepository extends JpaRepository<DebtReminder, UUID> {

    Page<DebtReminder> findByCreator_IdOrDebtor_Id(UUID creatorId, UUID debtorId, Pageable pageable);
    Page<DebtReminder> findByStatusAndCreator_IdOrStatusAndDebtor_Id(
            DebtStatusType status1, UUID creatorId, DebtStatusType status2, UUID debtorId, Pageable pageable);

}