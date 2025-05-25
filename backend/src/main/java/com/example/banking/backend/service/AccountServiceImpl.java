package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.response.account.CreateCustomerAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.mapper.account.AccountMapper;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.repository.account.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @Override
    public ApiResponse<GetAccountResponse> getAccount(UUID accountId) {
        Account account = accountRepository.findByAccountId(accountId);

        if (account == null) {
            return ApiResponse.<GetAccountResponse>builder()
                    .status(HttpStatus.NO_CONTENT.value())
                    .message("Account not found!")
                    .build();
        }

        GetAccountResponse accountResponse = AccountMapper.INSTANCE.accountToGetAccountResponse(account);

        return ApiResponse.<GetAccountResponse>builder()
                .data(accountResponse)
                .status(HttpStatus.OK.value())
                .message("Account found successfully!")
                .build();
    }

    @Override
    public ApiResponse<GetAccountTransactionsResponse> getAccountTransactions(UUID accountId, Integer size, Integer pagination, TransactionType type) {
        Account account = accountRepository.getPaginatedTransactions(accountId, size, pagination, type);

        if (account == null) {
            return ApiResponse.<GetAccountTransactionsResponse>builder()
                    .status(HttpStatus.NO_CONTENT.value())
                    .message("Account not found!")
                    .build();
        }

        GetAccountTransactionsResponse accountTransactionsResponse = AccountMapper.INSTANCE.accountToGetAccountTransactionsResponse(account);

        return ApiResponse.<GetAccountTransactionsResponse>builder()
                .data(accountTransactionsResponse)
                .status(HttpStatus.OK.value())
                .message("Account's transaction history found successfully!")
                .build();
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
