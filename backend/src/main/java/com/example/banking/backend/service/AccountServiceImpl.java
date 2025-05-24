package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.response.account.CreateCustomerAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.type.TransactionType;

import java.util.UUID;

public class AccountServiceImpl implements AccountService {
    @Override
    public ApiResponse<GetAccountResponse> getAccount(UUID accountId) {
        return null;
    }

    @Override
    public ApiResponse<GetAccountTransactionsResponse> getAccountTransactions(UUID accountId, Integer size, Integer pagination, TransactionType type) {
        return null;
    }

    @Override
    public ApiResponse<CreateCustomerAccountResponse> createCustomerAccount(CreateCustomerRequest request) {
        return null;
    }

    @Override
    public ApiResponse rechargeAccount(RechargeAccountRequest request) {
        return null;
    }
}
