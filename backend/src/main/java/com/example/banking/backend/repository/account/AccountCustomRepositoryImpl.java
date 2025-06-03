package com.example.banking.backend.repository.account;

import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Transaction;
import com.example.banking.backend.model.type.TransactionType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.*;
import java.util.stream.Collectors;

public class AccountCustomRepositoryImpl implements AccountCustomRepository{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Account getPaginatedTransactions(UUID accountId, int page, int size, TransactionType type) {
        // Fetch account with transactions
        Account account = entityManager.createQuery("""
                SELECT a FROM Account a
                LEFT JOIN FETCH a.transactionsAsSender
                LEFT JOIN FETCH a.transactionsAsReceiver
                WHERE a.accountId = :accountId
                
            """, Account.class)
                .setParameter("accountId", accountId)
                .getSingleResult();

        List<Transaction> senderList = account.getTransactionsAsSender().stream()
                .filter(tx -> type == null || tx.getTransactionType() == type)
                .sorted(Comparator.comparing(Transaction::getCreatedAt).reversed())
                .collect(Collectors.toList());

        int senderStart = Math.min(page * size, senderList.size());
        int senderEnd = Math.min(senderStart + size, senderList.size());
        Set<Transaction> paginatedSenderTxs = new LinkedHashSet<>(senderList.subList(senderStart, senderEnd));

        // Filter receiver transactions by type if provided
        List<Transaction> receiverList = account.getTransactionsAsReceiver().stream()
                .filter(tx -> type == null || tx.getTransactionType() == type)
                .sorted(Comparator.comparing(Transaction::getCreatedAt).reversed()) // Optional: sort newest first
                .collect(Collectors.toList());

        // Pagination indices for receiver
        int receiverStart = Math.min(page * size, receiverList.size());
        int receiverEnd = Math.min(receiverStart + size, receiverList.size());
        Set<Transaction> paginatedReceiverTxs = new LinkedHashSet<>(receiverList.subList(receiverStart, receiverEnd));
        account.setTransactionsAsSender(paginatedSenderTxs);
        account.setTransactionsAsReceiver(paginatedReceiverTxs);

        return account;
    }
}
