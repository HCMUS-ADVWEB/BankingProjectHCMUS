package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.response.account.AccountInfoResult;
import com.example.banking.backend.dto.response.account.CreateCustomerAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.type.TransactionType;

import java.util.UUID;

public interface AccountService {

    ApiResponse<GetAccountResponse> getAccount(UUID userId);

    ApiResponse<GetAccountTransactionsResponse> getAccountTransactions(
            String accountNumber,
            Integer size,
            Integer pagination,
            TransactionType type);

    ApiResponse<GetAccountTransactionsResponse> getCustomerTransactions(
            Integer size,
            Integer pagination,
            TransactionType type);

    ApiResponse<CreateCustomerAccountResponse> createCustomerAccount(CreateCustomerRequest request);

    void rechargeAccount(String accountNumber, Long rechargeAmount);

    Double debitAccount(UUID accountId, Double amount);

    AccountInfoResult processAccountInfo(
            AccountInfoRequest request,
            String sourceBankCode,
            String timestamp,
            String receivedHmac) throws Exception;

    AccountInfoResult getAccountInfo(AccountInfoRequest request);

    ApiResponse<?> closeAccount();
}
