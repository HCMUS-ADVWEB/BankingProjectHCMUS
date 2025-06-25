package com.example.banking.backend.repository;

import com.example.banking.backend.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    @Query("SELECT t FROM Transaction t WHERE t.fromBank.id = :bankId AND t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findByBankIdAndDateRange(UUID bankId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT t FROM Transaction t WHERE t.fromBank.id = :bankId AND t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findByBankIdAndDateRange(UUID bankId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    List<Transaction> findByCreatedAtBetween(Instant startDate, Instant endDate);

    @Query("SELECT t FROM Transaction t WHERE t.fromAccount.accountId = :fromAccountId")
    Page<Transaction> findByFromAccountId(UUID fromAccountId, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.updatedAt BETWEEN :startDate AND :endDate
            AND (t.fromBank.bankCode IS NOT NULL OR t.toBank.bankCode IS NOT NULL)
            """)
    Page<Transaction> findByUpdatedAtBetween(Instant startDate, Instant endDate, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.updatedAt BETWEEN :startDate AND :endDate
            AND (t.fromBank.bankCode IS NOT NULL OR t.toBank.bankCode IS NOT NULL)
            """)
    List<Transaction> findByUpdatedAtBetween(Instant startDate, Instant endDate);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.updatedAt BETWEEN :startDate AND :endDate
            AND (:bankCode IS NULL OR t.fromBank.bankCode = :bankCode OR t.toBank.bankCode = :bankCode)
            """)
    List<Transaction> findByBankCodeAndUpdatedAtBetween(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("bankCode") String bankCode);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.updatedAt BETWEEN :start AND :end
            AND (:bankCode IS NULL OR t.fromBank.bankCode = :bankCode OR t.toBank.bankCode = :bankCode)
            """)
    Page<Transaction> findByUpdatedAtBetweenAndBankCode(
            @Param("start") Instant start,
            @Param("end") Instant end,
            @Param("bankCode") String bankCode,
            Pageable pageable);

}
