package com.example.banking.backend.repository.account;

import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.type.TransactionType;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AccountCustomRepository {
    Account getPaginatedTransactions(String accountNumber, int page, int size, TransactionType type);
}
