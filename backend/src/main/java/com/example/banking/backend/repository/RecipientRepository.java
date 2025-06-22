package com.example.banking.backend.repository;

import com.example.banking.backend.model.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecipientRepository extends JpaRepository<Recipient, UUID> {
    @Query("SELECT r FROM Recipient r WHERE r.recipientAccountNumber = :accountNumber AND r.bank.id = :bankId")
    Optional<Recipient> findByAccountNumberAndBankId(String accountNumber, UUID bankId);

    @Query("SELECT r FROM Recipient r WHERE r.recipientAccountNumber = :accountNumber")
    Optional<Recipient> findByAccountNumber(String accountNumber);
}