package com.example.banking.backend.service;

import com.example.banking.backend.config.BankCodeConfig;
import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.AccountExternalRequest;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.account.CreateCustomerRequest;
import com.example.banking.backend.dto.request.auth.CreateUserRequest;
import com.example.banking.backend.dto.request.user.UpdateUserRequest;
import com.example.banking.backend.dto.response.account.*;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.exception.ExistenceException;
import com.example.banking.backend.exception.InvalidUserException;
import com.example.banking.backend.exception.NotFoundException;
import com.example.banking.backend.mapper.account.AccountMapper;
import com.example.banking.backend.mapper.user.UserMapper;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Bank;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.AccountType;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.model.type.UserRoleType;
import com.example.banking.backend.repository.BankRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.repository.account.AccountRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.util.CryptoUtils;
import com.example.banking.backend.util.SignatureUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserService userService;
    private final BankCodeConfig bankCodeConfig;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final BankRepository bankRepository;

    private Account getAccountCurrentUser() {
        return accountRepository.findByUserId(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new InvalidUserException("Please switch account."));
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

    private User getCurrentUser() {
        return userRepository.findById(Objects.requireNonNull(CustomContextHolder.getCurrentUserId()))
                .orElseThrow(() -> new NotFoundException("NOT FOUND CURRENT USER"));
    }

    @Override
    public ApiResponse<GetAccountResponse> getAccount(UUID userId) {
        Account account = accountRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("Account not found"));

        GetAccountResponse accountResponse = AccountMapper.INSTANCE.accountToGetAccountResponse(account);

        return ApiResponse.<GetAccountResponse>builder()
                .data(accountResponse)
                .status(HttpStatus.OK.value())
                .message("Account found successfully!")
                .build();
    }

    @Override
    public ApiResponse<GetAccountTransactionsResponse> getAccountTransactions(String accountNumber, Integer size, Integer pagination, TransactionType type) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElseThrow(() -> new NotFoundException("Account not found!"));

        PaginatedAccountTransactionDto paginatedDto = accountRepository.getPaginatedTransactions(
                account.getAccountId(),
                pagination,
                size,
                type
        );

        if (paginatedDto == null) {
            throw new NotFoundException("Account not found!");
        }

        GetAccountTransactionsResponse accountTransactionsResponse = AccountMapper.INSTANCE.accountToGetAccountTransactionsResponse(
                paginatedDto.getAccount(),
                paginatedDto.getTotalTransactions(),
                paginatedDto.getTotalPages()
        );

        return ApiResponse.<GetAccountTransactionsResponse>builder()
                .data(accountTransactionsResponse)
                .status(HttpStatus.OK.value())
                .message("Account's transaction history found successfully!")
                .build();
    }

    @Override
    public ApiResponse<GetAccountTransactionsResponse> getCustomerTransactions(Integer size, Integer pagination, TransactionType type) {
        if (size <= 0 || pagination <= 0) {
            throw new IllegalArgumentException("Limit must be positive and page must be 1 or greater");
        }

        PaginatedAccountTransactionDto paginatedDto = accountRepository.getPaginatedTransactions(
                getAccountCurrentUser().getAccountId(),
                pagination,
                size,
                type
        );

        if (paginatedDto == null) {
            throw new NotFoundException("Account not found!");
        }

        GetAccountTransactionsResponse accountTransactionsResponse = AccountMapper.INSTANCE.accountToGetAccountTransactionsResponse(
                paginatedDto.getAccount(),
                paginatedDto.getTotalTransactions(),
                paginatedDto.getTotalPages()
        );

        return ApiResponse.<GetAccountTransactionsResponse>builder()
                .data(accountTransactionsResponse)
                .status(HttpStatus.OK.value())
                .message("Account's transaction history found successfully!")
                .build();
    }


    @Override
    public ApiResponse<CreateCustomerAccountResponse> createCustomerAccount(CreateCustomerRequest request) {

        if (accountRepository.findByUserEmail(request.getUsername()).isPresent()
                || accountRepository.findByUserPhone(request.getPhone()).isPresent()
                || accountRepository.findByUserEmail(request.getEmail()).isPresent()) {

            throw new ExistenceException("Account already exists!");
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

    @Override
    public void rechargeAccount(String accountNumber, Long rechargeAmount) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElseThrow(() -> new NotFoundException("Account not found!"));


        account.setBalance(account.getBalance() + rechargeAmount);

        accountRepository.save(account);

    }

    @Override
    public Double debitAccount(UUID userId, Double amount) {
        Account account = accountRepository.findByUserId(userId).orElseThrow(
                () -> new NotFoundException("Account not found!"));

        account.setBalance(account.getBalance() - amount);

        accountRepository.save(account);

        return account.getBalance();
    }

    @Override
    public AccountInfoResult getAccountInfo(AccountInfoRequest request) {
        if (request == null)
            throw new BadRequestException("Invalid request parameters");
        //Internal
        if (request.getBankCode() == null || request.getBankCode().trim().isEmpty()) {
            Account sourceAccount = accountRepository.findByAccountNumber(request.getAccountNumber())
                    .orElseThrow(() -> new NotFoundException("Account not found"));
            Account userAccount = getCurrentUser().getAccount();
            if (sourceAccount.getUser().getId() == userAccount.getUser().getId()) {
                throw new BadRequestException("Cannot get account info of your own account");
            }
            return new AccountInfoResult(sourceAccount.getAccountNumber(), sourceAccount.getUser().getFullName());
        } else {
            // External

            Account sourceAccount = accountRepository.findByUserId(getCurrentUser().getId())
                    .orElseThrow(() -> new NotFoundException("Source account not found"));

            Bank destinationBank = bankRepository.findByBankCode(request.getBankCode())
                    .orElseThrow(() -> new NotFoundException("Destination bank not found"));

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
                String hashInput = requestBody + timestamp + "FIN" + destinationBank.getSecretKey();
                String hmac = CryptoUtils.generateHMAC(hashInput, destinationBank.getSecretKey());
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Bank-Code", "FIN");
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
    public ApiResponse<?> closeAccount() {
        User user = getCurrentUser();

        UpdateUserRequest updateUserRequest = UserMapper.INSTANCE.userToUpdateUserRequest(user);

        updateUserRequest.setIsActive(false);

        userService.updateUser(user.getId(), updateUserRequest);

        return ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Closed account successfully")
                .build();
    }

    @Override
    public AccountInfoResult processAccountInfo(AccountInfoRequest request, String sourceBankCode,
                                                String timestamp, String receivedHmac) throws Exception {
        if (request == null || request.getAccountNumber() == null || request.getAccountNumber().trim().isEmpty()) {
            throw new BadRequestException("Invalid request parameters");
        }
        Bank sourceBank = bankRepository.findByBankCode(sourceBankCode)
                .orElseThrow(() -> new IllegalArgumentException("Your bank is not linked to FIN"));
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody = objectMapper.writeValueAsString(request);
        String expectedHashInput = requestBody + timestamp + sourceBankCode + sourceBank.getSecretKey();
        String expectedHmac = CryptoUtils.generateHMAC(expectedHashInput, sourceBank.getSecretKey());
        if (!SignatureUtil.isTimestampWithin5Minutes(timestamp)) throw new BadRequestException("Expired ,do it again");
        if (!expectedHmac.equals(receivedHmac)) {
            throw new BadRequestException("HMAC verification failed - packet integrity compromised");
        }
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new NotFoundException("Account not found: " + request.getAccountNumber()));
        return new AccountInfoResult(
                account.getAccountNumber(),
                account.getUser().getFullName()
        );
    }
}
