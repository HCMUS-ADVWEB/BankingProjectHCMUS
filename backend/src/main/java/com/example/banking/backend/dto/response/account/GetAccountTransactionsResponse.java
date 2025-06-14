package com.example.banking.backend.dto.response.account;

import com.example.banking.backend.dto.response.transaction.TransactionInfoDto;
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
    private Set<TransactionInfoDto> transactionsAsSender;
    private Set<TransactionInfoDto> transactionsAsReceiver;
}
