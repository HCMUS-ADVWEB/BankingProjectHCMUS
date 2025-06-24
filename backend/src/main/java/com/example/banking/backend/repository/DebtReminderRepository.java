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
    
    Page<DebtReminder> findByCreator_Id(UUID creatorId, Pageable pageable);
    Page<DebtReminder> findByDebtor_Id(UUID debtorId, Pageable pageable);
    Page<DebtReminder> findByStatusAndCreator_Id(DebtStatusType status, UUID creatorId, Pageable pageable);
    Page<DebtReminder> findByStatusAndDebtor_Id(DebtStatusType status, UUID debtorId, Pageable pageable);
}