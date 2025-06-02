package com.example.banking.backend.repository;

import com.example.banking.backend.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
  Optional<RefreshToken> findByIdAndExpiresAtAfter(UUID id, Instant date);
}