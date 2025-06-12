package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.response.account.CreateCustomerAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.type.TransactionType;

import java.util.UUID;

public interface AccountService {
    ApiResponse<GetAccountResponse> getAccount(UUID userId);

    ApiResponse<GetAccountTransactionsResponse> getAccountTransactions(UUID accountId, Integer size, Integer pagination, TransactionType type);

    //void deposit(UUID accountId, DepositRequest request);

    ApiResponse<CreateCustomerAccountResponse> createCustomerAccount(CreateCustomerRequest request);

    ApiResponse rechargeAccount(RechargeAccountRequest request);

    Double debitAccount(UUID accountId, Double amount);
}
