package com.example.banking.backend.service;

import com.example.banking.backend.config.BankCodeConfig;
import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.request.auth.CreateUserRequest;
import com.example.banking.backend.dto.response.account.CreateCustomerAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.mapper.account.AccountMapper;
import com.example.banking.backend.mapper.account.UserMapper;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.AccountType;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.model.type.UserRoleType;
import com.example.banking.backend.repository.account.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    private final UserService userService;
    private final BankCodeConfig bankCodeConfig;

    @Override
    public ApiResponse<GetAccountResponse> getAccount(UUID userId) {
        Account account = accountRepository.findByUserId(userId).orElseThrow(
                () -> new RuntimeException("Account not found!")
        );

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
        CreateUserRequest userRequest = CreateUserRequest.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .email(request.getEmail())
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .address(request.getAddress())
                .dob(request.getDob())
                .role(UserRoleType.CUSTOMER)
                .isActive(true)
                .build();

        UserDto userDto = userService.createUser(userRequest);
        User user = userService.getUser(userDto.getId());

        UUID accountId = UUID.randomUUID();
        Account account = new Account(accountId,
                generateAccountNumber(accountId),
                0.0,
                user,
                AccountType.PAYMENT,
                true,
                user.getCreatedAt(),
                user.getUpdatedAt(),
                Set.of(),
                Set.of());

        Account savedAccount = accountRepository.save(account);

        return ApiResponse.<CreateCustomerAccountResponse>builder()
                .data(new CreateCustomerAccountResponse(savedAccount.getAccountNumber()))
                .status(HttpStatus.CREATED.value())
                .message("Account created successfully!")
                .build();
    }

    private String generateAccountNumber(UUID accountId) {
        String bankCode = bankCodeConfig.getBankCode();

        String input = accountId.toString();
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());

            BigInteger no = new BigInteger(1, messageDigest);
            String hashText = no.toString(10);

            while (hashText.length() < 12) {
                hashText = "0" + hashText;
            }

            String result = hashText.substring(0, 12);

            return bankCode + result;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ApiResponse rechargeAccount(RechargeAccountRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber()).orElseThrow(() -> new RuntimeException(
                "Account not found!"
        ));


        account.setBalance(account.getBalance() + request.getRechargeAmount());

        accountRepository.save(account);

        return ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Account recharged successfully!")
                .build();
    }
}
