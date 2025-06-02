package com.example.banking.backend.repository;

import com.example.banking.backend.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BankRepository extends JpaRepository<Bank, UUID> {
    Optional<Bank> findByBankName(String bankName);
}