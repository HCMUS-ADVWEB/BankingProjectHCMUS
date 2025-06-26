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

        // Apply filters and sorting
        List<Transaction> senderList = account.getTransactionsAsSender().stream()
                .filter(tx -> type == null || tx.getTransactionType() == type)
                .sorted(Comparator.comparing(Transaction::getCreatedAt).reversed())
                .collect(Collectors.toList());

        List<Transaction> receiverList = account.getTransactionsAsReceiver().stream()
                .filter(tx -> type == null || tx.getTransactionType() == type)
                .sorted(Comparator.comparing(Transaction::getCreatedAt).reversed())
                .collect(Collectors.toList());

        // Combine all transactions
        List<Transaction> allTransactions = new ArrayList<>();
        allTransactions.addAll(senderList);
        allTransactions.addAll(receiverList);

        int totalTransactions = allTransactions.size();
        int totalPages = (int) Math.ceil((double) totalTransactions / size);

        // Pagination
        page--;
        int start = Math.min(page * size, totalTransactions);
        int end = Math.min(start + size, totalTransactions);
        List<Transaction> paginatedList = allTransactions.subList(start, end);

        // Separate back into sender and receiver sets for Account entity
        Set<Transaction> paginatedSenderTxs = paginatedList.stream()
                .filter(senderList::contains)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<Transaction> paginatedReceiverTxs = paginatedList.stream()
                .filter(receiverList::contains)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        account.setTransactionsAsSender(paginatedSenderTxs);
        account.setTransactionsAsReceiver(paginatedReceiverTxs);

        return new PaginatedAccountTransactionDto(account, totalTransactions, totalPages);
    }
}
