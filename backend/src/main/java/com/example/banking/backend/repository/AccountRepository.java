package com.example.banking.backend.repository;

import com.example.banking.backend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByUserId(UUID userId);
    Optional<Account> findByAccountNumber(String accountNumber);
}