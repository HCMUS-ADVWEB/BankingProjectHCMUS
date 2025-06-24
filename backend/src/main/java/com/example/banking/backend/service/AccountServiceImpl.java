package com.example.banking.backend.service;

import com.example.banking.backend.config.BankCodeConfig;
import com.example.banking.backend.dto.request.account.AccountExternalRequest;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.account.RechargeAccountRequest;
import com.example.banking.backend.dto.request.auth.ChangePasswordRequest;
import com.example.banking.backend.dto.request.auth.CreateUserRequest;
import com.example.banking.backend.dto.response.account.*;
import com.example.banking.backend.dto.response.transaction.TransactionDto;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.mapper.account.AccountMapper;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Bank;
import com.example.banking.backend.model.Transaction;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.AccountType;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.model.type.UserRoleType;
import com.example.banking.backend.repository.BankRepository;
import com.example.banking.backend.repository.TransactionRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.repository.account.AccountRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.util.CryptoUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor

public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;
    private final BankCodeConfig bankCodeConfig;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final RestTemplate restTemplate;
    private final BankRepository bankRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public ApiResponse<GetAccountResponse> getAccount(UUID userId) {
        Account account = accountRepository.findByUserId(userId).orElse(null);

        if (account == null) {
            return ApiResponse.<GetAccountResponse>builder()
                    .data(null)
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Account found successfully!")
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

    public ApiResponse<GetAccountTransactionsResponse> getAccountTransactions(String accountNumber, Integer size, Integer pagination, TransactionType type) {
        Account account = accountRepository.getPaginatedTransactions(accountNumber, size, pagination, type);


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

    Account getAccountCurrentUser() {
        return accountRepository.findByUserId(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Please sign in first "));
    }

    @Override
    public ApiResponse<List<TransactionDto>> getCustomerTransactions(Integer size, Integer pagination) {
        if (size <= 0 || pagination <= 0) {
            throw new IllegalArgumentException("Limit must be positive and page must be 1 or greater");
        }

        Pageable pageable = PageRequest.of(pagination - 1, size);
        Page<Transaction> transactionPage = (Page<Transaction>) transactionRepository.findByFromAccountId(getAccountCurrentUser().getAccountId(), pageable);
        List<TransactionDto> transactions = transactionPage.getContent().stream()
                .map(transaction -> new TransactionDto(
                        transaction.getId(),
                        transaction.getToBank() != null ? transaction.getToBank().getId() : null,
                        transaction.getAmount(),
                        transaction.getUpdatedAt(),
                        transaction.getMessage()
                ))
                .collect(Collectors.toList());

        return ApiResponse.<List<TransactionDto>>builder()
                .data(transactions)
                .status(HttpStatus.OK.value())
                .message("Account's transaction history found successfully!")
                .build();
    }

    @Override
    public ApiResponse<CreateCustomerAccountResponse> createCustomerAccount(CreateCustomerRequest request) {

        if (accountRepository.findByUserEmail(request.getUsername()).isPresent()
                || accountRepository.findByUserPhone(request.getPhone()).isPresent()
                || accountRepository.findByUserEmail(request.getEmail()).isPresent()) {

            return ApiResponse.<CreateCustomerAccountResponse>builder()
                    .data(null)
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Account already exists!")
                    .build();
        }

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
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber()).orElse(null);

        if (account == null) {
            return ApiResponse.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Account not found!")
                    .build();
        }


        account.setBalance(account.getBalance() + request.getRechargeAmount());

        accountRepository.save(account);

        return ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Account recharged successfully!")
                .build();
    }

    @Override
    public Double debitAccount(UUID userId, Double amount) {
        Account account = accountRepository.findByUserId(userId).orElseThrow(
                () -> new RuntimeException("Account not found!"));

        account.setBalance(account.getBalance() - amount);

        accountRepository.save(account);

        return account.getBalance();
    }

    User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new BadRequestException("NOT FOUND CURRENT USER"));
    }

    @Override
    public Boolean changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();
        System.out.println("Old Password: " + request.getOldPassword());
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        if (!otpService.validateOtp(user.getId(), OtpType.PASSWORD_CHANGE, request.getOtp())) {
            throw new BadRequestException("OTP is not true , please try again");
        }
        String hashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return true;
    }

    public AccountInfoResult getAccountInfo(AccountInfoRequest request) {
        if (request == null)
            throw new BadRequestException("Invalid request parameters");
        //Internal
        if (request.getBankCode() == null || request.getBankCode().trim().isEmpty()) {
            Account sourceAccount = accountRepository.findByAccountNumber(request.getAccountNumber())
                    .orElseThrow(() -> new IllegalArgumentException("Account not found"));
            return new AccountInfoResult(sourceAccount.getAccountNumber(), sourceAccount.getUser().getFullName());
        } else {
            // External

            Account sourceAccount = accountRepository.findByUserId(getCurrentUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Source account not found"));

            Bank destinationBank = bankRepository.findByBankCode(request.getBankCode())
                    .orElseThrow(() -> new IllegalArgumentException("Destination bank not found"));

            String destinationApiUrl = destinationBank.getApiEndpoint();
            if (destinationApiUrl == null || destinationApiUrl.trim().isEmpty()) {
                throw new BadRequestException("Destination bank API endpoint not configured");
            }

            try {
                AccountExternalRequest interbankRequest = new AccountExternalRequest(
                        request.getAccountNumber()
                );
                String timestamp = String.valueOf(Instant.now().toEpochMilli());
                ObjectMapper objectMapper = new ObjectMapper();
                String requestBody = objectMapper.writeValueAsString(interbankRequest);
                String hashInput = requestBody + timestamp + request.getBankCode() + destinationBank.getSecretKey();
                String hmac = CryptoUtils.generateHMAC(hashInput, destinationBank.getSecretKey());
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Bank-Code", request.getBankCode());
                headers.set("X-Timestamp", timestamp);
                headers.set("X-Request-Hash", hmac);
                HttpEntity<AccountExternalRequest> httpEntity = new HttpEntity<>(interbankRequest, headers);
                ResponseEntity<Map> response = restTemplate.exchange(
                        destinationApiUrl + "/api/linked-banks/account-info",
                        HttpMethod.POST,
                        httpEntity,
                        Map.class
                );
                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    Map<String, Object> responseBody = response.getBody();
                    Boolean success = (Boolean) responseBody.get("success");
                    if (response.getStatusCode() == HttpStatus.OK) {
                        Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
                        String accountNumber = (String) data.get("accountNumber");
                        String fullName = (String) data.get("fullName");
                        return new AccountInfoResult(accountNumber, fullName);
                    }
                } else {
                    throw new BadRequestException(
                            "External account info failed: HTTP " + response.getStatusCode());
                }
            } catch (Exception e) {
                throw new BadRequestException("Error processing external account info request: " + e.getMessage());
            }
        }
        return null;
    }

    @Override
    public AccountInfoResponse processAccountInfo(AccountInfoRequest request, String sourceBankCode,
                                                  String timestamp, String receivedHmac) throws Exception {
        if (request == null || request.getAccountNumber() == null || request.getAccountNumber().trim().isEmpty()) {
            throw new BadRequestException("Invalid request parameters");
        }
        Bank sourceBank = bankRepository.findByBankCode(sourceBankCode)
                .orElseThrow(() -> new IllegalArgumentException("Your bank is not linked to FIN" ));
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody = objectMapper.writeValueAsString(request);
        String expectedHashInput = requestBody + timestamp + sourceBankCode + sourceBank.getSecretKey();
        String expectedHmac = CryptoUtils.generateHMAC(expectedHashInput, sourceBank.getSecretKey());

        if (!expectedHmac.equals(receivedHmac)) {
            throw new BadRequestException("HMAC verification failed - packet integrity compromised");
        }
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new BadRequestException("Account not found: " + request.getAccountNumber()));
        return new AccountInfoResponse(
                account.getAccountNumber(),
                account.getUser().getFullName()
        );
    }
}
