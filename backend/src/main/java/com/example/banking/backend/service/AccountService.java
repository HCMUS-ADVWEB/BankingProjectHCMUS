package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.DepositRequest;

import java.util.UUID;

public interface AccountService {

    void getAccounts();

    void getAccountDetails(UUID accountId);

    void deposit(UUID accountId, DepositRequest request);

    void createCustomerAccount(CreateCustomerRequest request);
}
