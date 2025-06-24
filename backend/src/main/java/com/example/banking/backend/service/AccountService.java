package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.request.auth.ChangePasswordRequest;
import com.example.banking.backend.dto.response.account.*;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.response.transaction.TransactionDto;
import com.example.banking.backend.model.type.TransactionType;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;
import java.util.UUID;

public interface AccountService {
    ApiResponse<GetAccountResponse> getAccount(UUID userId);

    ApiResponse<GetAccountTransactionsResponse> getAccountTransactions(String accountNumber, Integer size,
            Integer pagination, TransactionType type);
    // void deposit(UUID accountId, DepositRequest request);
    ApiResponse<GetAccountTransactionsResponse> getCustomerTransactions(Integer size, Integer pagination, TransactionType type);

    ApiResponse<CreateCustomerAccountResponse> createCustomerAccount(CreateCustomerRequest request);

    void rechargeAccount(String accountNumber, Long rechargeAmount);

    Double debitAccount(UUID accountId, Double amount);


    public AccountInfoResponse processAccountInfo(AccountInfoRequest request, String sourceBankCode,
                                                  String timestamp, String receivedHmac) throws Exception;

    public AccountInfoResult getAccountInfo(AccountInfoRequest request);

}
