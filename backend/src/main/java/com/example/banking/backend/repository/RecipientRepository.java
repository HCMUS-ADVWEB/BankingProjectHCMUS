package com.example.banking.backend.repository;

import com.example.banking.backend.model.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RecipientRepository extends JpaRepository<Recipient, UUID> {
}