package com.example.banking.backend.repository;

import com.example.banking.backend.model.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface RecipientRepository extends JpaRepository<Recipient, UUID> {
    @Query("SELECT r FROM Recipient r WHERE r.recipientAccountNumber = :accountNumber AND r.bank.id = :bankId")
    Optional<Recipient> findByAccountNumberAndBankId(String accountNumber, UUID bankId);
}