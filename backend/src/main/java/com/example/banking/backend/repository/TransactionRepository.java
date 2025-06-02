package com.example.banking.backend.repository;

import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    Optional<Transaction> findByAccountId(UUID accountId);
    @Query("SELECT t FROM Transaction t WHERE t.bankId = :bankId AND t.transactionDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByBankIdAndDateRange(UUID bankId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT t FROM Transaction t WHERE t.bankId = :bankId AND t.transactionDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByBankIdAndDateRange(UUID bankId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    Page<Transaction> findByAccountId(UUID accountId, Pageable pageable);
}

