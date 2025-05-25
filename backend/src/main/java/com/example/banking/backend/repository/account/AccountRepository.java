package com.example.banking.backend.repository.account;

import com.example.banking.backend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID>, AccountCustomRepository {
    Account findByAccountId(UUID accountId);


}