package com.example.banking.backend.repository.account;

import com.example.banking.backend.dto.response.account.PaginatedAccountTransactionDto;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Transaction;
import com.example.banking.backend.model.type.TransactionType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.*;
import java.util.stream.Collectors;

public class AccountCustomRepositoryImpl implements AccountCustomRepository {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public PaginatedAccountTransactionDto getPaginatedTransactions(UUID accountId, int page, int size, TransactionType type) {
        Account account = entityManager.createQuery("""
                SELECT a FROM Account a
                LEFT JOIN FETCH a.transactionsAsSender
                LEFT JOIN FETCH a.transactionsAsReceiver
                WHERE a.accountId = :accountId
            """, Account.class)
                .setParameter("accountId", accountId)
                .getSingleResult();

        // Combine both sender and receiver transactions, applying type filter if needed
        List<Transaction> allTransactions = new ArrayList<>();

        if (account.getTransactionsAsSender() != null) {
            allTransactions.addAll(account.getTransactionsAsSender().stream()
                    .filter(tx -> type == null || tx.getTransactionType() == type)
                    .toList());
        }

        if (account.getTransactionsAsReceiver() != null) {
            allTransactions.addAll(account.getTransactionsAsReceiver().stream()
                    .filter(tx -> type == null || tx.getTransactionType() == type)
                    .toList());
        }

        // Sort all combined transactions by createdAt descending
        allTransactions.sort(Comparator.comparing(Transaction::getCreatedAt).reversed());

        int totalTransactions = allTransactions.size();
        int totalPages = (int) Math.ceil((double) totalTransactions / size);

        // Pagination
        page--; // zero-based index
        int start = Math.min(page * size, totalTransactions);
        int end = Math.min(start + size, totalTransactions);
        List<Transaction> paginatedList = allTransactions.subList(start, end);

        // Separate back into sender and receiver sets for Account entity
        Set<Transaction> paginatedSenderTxs = paginatedList.stream()
                .filter(tx -> account.getTransactionsAsSender().contains(tx))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<Transaction> paginatedReceiverTxs = paginatedList.stream()
                .filter(tx -> account.getTransactionsAsReceiver().contains(tx))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        account.setTransactionsAsSender(paginatedSenderTxs);
        account.setTransactionsAsReceiver(paginatedReceiverTxs);

        return new PaginatedAccountTransactionDto(account, totalTransactions, totalPages);
    }

}
