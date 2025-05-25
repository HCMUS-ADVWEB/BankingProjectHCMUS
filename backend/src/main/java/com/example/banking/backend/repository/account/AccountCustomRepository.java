package com.example.banking.backend.repository.account;

import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.type.TransactionType;

import java.util.UUID;

public interface AccountCustomRepository {
    Account getPaginatedTransactions(UUID accountId, int page, int size, TransactionType type);
}
