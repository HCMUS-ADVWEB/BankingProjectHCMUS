package com.example.banking.backend.repository;

import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.UserRoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<User> findAllByRole(UserRoleType role);
}