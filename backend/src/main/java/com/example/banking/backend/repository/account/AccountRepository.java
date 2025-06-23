package com.example.banking.backend.repository.account;

import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID>, AccountCustomRepository {

    Optional<Account> findByUserId(@Param("userId") UUID userId);
    Optional<Account> findByAccountNumber(String accountNumber);
    Optional<Account> findByUserUsername(String username);
    Optional<Account> findByUserEmail(String email);
    Optional<Account> findByUserPhone(String phone);
    //Optional<Account> findByAccountNumberAndBankId(UUID bankId, UUID accountNumber);


}
