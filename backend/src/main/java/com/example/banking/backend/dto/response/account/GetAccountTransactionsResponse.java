package com.example.banking.backend.dto.response.account;

import com.example.banking.backend.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class GetAccountTransactionsResponse {
    private Set<Transaction> transactionsAsSender;
    private Set<Transaction> transactionsAsReceiver;
}
