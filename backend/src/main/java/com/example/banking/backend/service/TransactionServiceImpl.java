package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.response.account.AccountDto;
import com.example.banking.backend.dto.request.transaction.*;
import com.example.banking.backend.dto.response.account.ExternalAccountDto;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.exception.InvalidUserException;
import com.example.banking.backend.model.*;
import com.example.banking.backend.model.type.FeeType;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.model.type.TransactionStatusType;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.repository.*;
import com.example.banking.backend.repository.account.AccountRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.util.CryptoUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private TransactionRepository transactionRepository;
    private AccountRepository accountRepository;
    private BankRepository bankRepository;
    private UserRepository userRepository;
    private RecipientRepository recipientRepository;
    private final PrivateKey nhom3privateKey; // My bank
    private final RestTemplate restTemplate;
    OtpService otpService;


    private Transaction createPendingTransaction(Account sourceAccount, Bank destinationBank,
                                                 TransferExternalRequest request, double fee) {
        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.INTERBANK_TRANSFER);
        transaction.setFromBank(null);
        transaction.setFromAccount(sourceAccount);
        transaction.setFromAccountNumber(sourceAccount.getAccountNumber());
        transaction.setToBank(destinationBank);
        transaction.setToAccountNumber(request.getReceiverAccountNumber());
        transaction.setToAccount(null); // Không biết account object của ngân hàng khác
        transaction.setAmount(request.getAmount());
        transaction.setFee(fee);
        transaction.setFeeType(FeeType.SENDER); // Giả sử phí do người gửi trả);
        transaction.setMessage(request.getContent() != null ? request.getContent() : "");
        transaction.setStatus(TransactionStatusType.PENDING);
        return transaction;
    }

    public TransferResult externalTransfer(TransferExternalRequest request) throws Exception {
        try {
            if (request == null || request.getAmount() <= 0) {
                return new TransferResult(false, null, 0.0, 0.0, null, "Invalid request");
            }

            Account sourceAccount = accountRepository.findByUserId(getCurrentUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Source account not found"));

            if (sourceAccount.getBalance() < request.getAmount()) {
                return new TransferResult(false, null, request.getAmount(), 0.0, null, "Insufficient balance");
            }

            double fee = calculateFee(request.getAmount(), FeeType.SENDER);
            double totalAmount = request.getAmount() + fee;

            if (sourceAccount.getBalance() < totalAmount) {
                return new TransferResult(false, null, request.getAmount(), fee, null, "Insufficient balance after fee");
            }

            otpService.validateOtp(getCurrentUser().getId(), OtpType.TRANSFER, request.getOtp());

            Bank destinationBank = bankRepository.findByBankCode(request.getBankCode())
                    .orElseThrow(() -> new IllegalArgumentException("Destination bank not found"));

            // Tạo transaction record
            Account accountCurrentUser = getAccountCurrentUser();

            try {
                Transaction transaction = new Transaction();
                transaction.setTransactionType(TransactionType.INTERNAL_TRANSFER);
                transaction.setFromAccount(accountCurrentUser);
                transaction.setFromAccountNumber(accountCurrentUser.getAccountNumber());
                transaction.setToAccountNumber(request.getReceiverAccountNumber());
                transaction.setToAccount(null); // Không biết account object của ngân hàng khác
                transaction.setAmount(request.getAmount());
                transaction.setFee(fee);
                transaction.setFeeType(FeeType.SENDER);
                transaction.setStatus(TransactionStatusType.PENDING);
                transaction.setMessage(request.getContent());
                Instant now = Instant.now();
                transaction.setCreatedAt(now);
                transaction.setUpdatedAt(now);
                Transaction savedTransaction = transactionRepository.save(transaction);

                String destinationApiUrl = destinationBank.getApiEndpoint();
                if (destinationApiUrl == null || destinationApiUrl.trim().isEmpty()) {
                    transactionRepository.delete(savedTransaction);
                    throw new BadRequestException("Destination bank API endpoint is not configured");
                }

                try {
                    InterbankTransferRequest interbankRequest = new InterbankTransferRequest(
                            sourceAccount.getAccountNumber(),
                            request.getReceiverAccountNumber(),
                            request.getAmount(),
                            request.getContent() != null ? request.getContent() : ""
                    );

                    String timestamp =String.valueOf(Instant.now().toEpochMilli());
                    ObjectMapper objectMapper = new ObjectMapper();
                    String requestBody = objectMapper.writeValueAsString(interbankRequest);
                    String hashInput = requestBody + timestamp + request.getBankCode() + destinationBank.getSecretKey();
                    String hmac = CryptoUtils.generateHMAC(hashInput, destinationBank.getSecretKey());
                    String signature = CryptoUtils.signData(requestBody, nhom3privateKey);

                    // Setup headers
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    headers.set("Bank-Code", request.getBankCode());
                    headers.set("X-Timestamp", timestamp);
                    headers.set("X-Request-Hash", hmac);
                    headers.set("X-Signature", signature);

                    // Tạo HTTP entity
                    HttpEntity<InterbankTransferRequest> httpEntity = new HttpEntity<>(interbankRequest, headers);

                    // Gửi request đến ngân hàng đích
                    ResponseEntity<Map> response = restTemplate.exchange(
                            destinationApiUrl + "/api/linked-banks/transfers",
                            HttpMethod.POST,
                            httpEntity,
                            Map.class
                    );

                    // Xử lý response
                    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                        Map<String, Object> responseBody = response.getBody();
                        Boolean success = (Boolean) responseBody.get("success");

                        if (Boolean.TRUE.equals(success)) {
                            sourceAccount.setBalance(sourceAccount.getBalance() - totalAmount);
                            accountRepository.save(sourceAccount);

                            savedTransaction.setStatus(TransactionStatusType.COMPLETED);
                            transactionRepository.save(savedTransaction);

                            return new TransferResult(
                                    true,
                                    savedTransaction.getId().toString(),
                                    request.getAmount(),
                                    fee,
                                    request.getContent() != null ? request.getContent() : "",
                                    null
                            );
                        } else {
                            // Thất bại từ phía ngân hàng đích
                            transactionRepository.delete(savedTransaction);
                            String errorMessage = (String) responseBody.getOrDefault("message", "Transfer failed");
                            return new TransferResult(false, null, request.getAmount(), fee, null,
                                    "External transfer failed: " + errorMessage);
                        }
                    } else {
                        // HTTP error
                        transactionRepository.delete(savedTransaction);
                        return new TransferResult(false, null, request.getAmount(), fee, null,
                                "External transfer failed: HTTP " + response.getStatusCode());
                    }

                } catch (HttpClientErrorException e) {
                    transactionRepository.delete(savedTransaction);
                    return new TransferResult(false, null, request.getAmount(), fee, null,
                            "External transfer failed: HTTP Client Error - " + e.getMessage());

                } catch (HttpServerErrorException e) {
                    transactionRepository.delete(savedTransaction);
                    return new TransferResult(false, null, request.getAmount(), fee, null,
                            "External transfer failed: HTTP Server Error - " + e.getMessage());

                } catch (ResourceAccessException e) {
                    transactionRepository.delete(savedTransaction);
                    return new TransferResult(false, null, request.getAmount(), fee, null,
                            "External transfer failed: Connection Error - " + e.getMessage());

                } catch (Exception e) {
                    transactionRepository.delete(savedTransaction);
                    return new TransferResult(false, null, request.getAmount(), fee, null,
                            "External transfer failed: " + e.getMessage());
                }

            } catch (org.springframework.dao.InvalidDataAccessApiUsageException e) {
                if (e.getCause() instanceof org.hibernate.TransientPropertyValueException) {
                    throw new BadRequestException("Database constraint error: Invalid entity reference");
                }
                throw new BadRequestException("Database access error: " + e.getMessage());

            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                throw new BadRequestException("Database constraint violation: " + e.getMessage());

            } catch (org.springframework.transaction.TransactionSystemException e) {
                Throwable rootCause = e.getRootCause();
                if (rootCause != null) {
                }
                throw new BadRequestException("Transaction commit failed: " + e.getMessage());

            } catch (Exception e) {
                throw new BadRequestException("Transaction creation failed: " + e.getMessage());
            }

        } catch (IllegalArgumentException e) {
            return new TransferResult(false, null, 0.0, 0.0, null, e.getMessage());

        } catch (BadRequestException e) {
            throw e;

        } catch (Exception e) {
            throw new Exception("External transfer failed: " + e.getMessage(), e);
        }
    }

    @Override
    public DepositResult externalDeposit(InterbankTransferRequest request
            , String sourceBankCode, String timestamp, String receivedHmac, String signature) throws Exception {
        if (request == null || request.getAmount() <= 0 ||
                request.getSenderAccountNumber() == null || request.getReceiverAccountNumber() == null) {
            throw new BadRequestException("Invalid request parameters");
        }
        Bank sourceBank = bankRepository.findByBankCode(sourceBankCode)
                .orElseThrow(() -> new IllegalArgumentException("Source bank not found: " + sourceBankCode));
        Account destinationAccount = accountRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElse(null);

        if (destinationAccount == null) {
            throw new BadRequestException("Destination account not found: " + request.getReceiverAccountNumber());
        }

        // Verify HMAC
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody = objectMapper.writeValueAsString(request);
        String expectedHashInput = requestBody + timestamp + sourceBankCode + sourceBank.getSecretKey();
        String expectedHmac = CryptoUtils.generateHMAC(expectedHashInput, sourceBank.getSecretKey());

        if (!expectedHmac.equals(receivedHmac)) {
            throw new BadRequestException("HMAC verification failed - packet integrity compromised");
        }

        // Verify signature
        PublicKey sourcePublicKey = CryptoUtils.loadPublicKey(sourceBank.getPublicKey());
        if (sourcePublicKey == null || !CryptoUtils.verifySignature(requestBody, signature, sourcePublicKey)) {
            throw new BadRequestException("Digital signature verification failed");
        }
        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.INTERBANK_TRANSFER);
        transaction.setFromBank(sourceBank);
        transaction.setFromAccount(null);
        transaction.setFromAccountNumber(request.getSenderAccountNumber());
        transaction.setToBank(null);
        transaction.setToAccount(destinationAccount);
        transaction.setToAccountNumber(request.getReceiverAccountNumber());
        transaction.setAmount(request.getAmount());
        transaction.setFee(0.0); // Người nhận không chịu phí
        transaction.setFeeType(null);
        transaction.setMessage(request.getContent() != null ? request.getContent() :
                "Interbank transfer from " + sourceBank.getBankName());
        transaction.setStatus(TransactionStatusType.COMPLETED);

        Transaction savedTransaction = transactionRepository.save(transaction);
        double oldBalance = destinationAccount.getBalance();
        double newBalance = oldBalance + request.getAmount();
        destinationAccount.setBalance(newBalance);
        accountRepository.save(destinationAccount);

        return new DepositResult(
                true,
                savedTransaction.getId().toString(),
                newBalance,
                "Transfer completed successfully"
        );
    }


    private double calculateFee(double amount, FeeType feeType) {
        return 0.0;
    }

    Account getAccountCurrentUser() {
        return accountRepository.findByUserId(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Please sign in first "));
    }

    Account getAccountFromNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new BadRequestException("ACCOUNT RECEIVER NOT FOUND"));
    }

    User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new BadRequestException("NOT FOUND CURRENT USER"));
    }

    @Override
    @Transactional
    public TransferResult internalTransfer(TransferRequest request) {
        try {

            Account accountCurrentUser = getAccountCurrentUser();
            Account toAccount = getAccountFromNumber(request.getAccountNumberReceiver());

            if (toAccount == null) {
                throw new BadRequestException("Receiver account not found");
            }

            // Kiểm tra số dư
            double fee = calculateFee(request.getAmount(), request.getFeeType());
            double totalAmount = request.getAmount() + fee;

            if (accountCurrentUser.getBalance() < totalAmount) {
                throw new BadRequestException("Insufficient balance");
            }
            Transaction transaction = new Transaction();
            transaction.setTransactionType(TransactionType.INTERNAL_TRANSFER);
            transaction.setFromAccount(accountCurrentUser);
            transaction.setFromAccountNumber(accountCurrentUser.getAccountNumber());
            transaction.setToAccountNumber(request.getAccountNumberReceiver());
            transaction.setToAccount(toAccount);
            transaction.setAmount(request.getAmount());
            transaction.setFee(fee);
            transaction.setFeeType(request.getFeeType());
            transaction.setStatus(TransactionStatusType.PENDING);
            transaction.setMessage(request.getMessage());

            // Set timestamps manually
            Instant now = Instant.now();
            transaction.setCreatedAt(now);
            transaction.setUpdatedAt(now);
            otpService.validateOtp(
                    getCurrentUser().getId(),
                    OtpType.TRANSFER,
                    request.getOtp());
            var savedTransaction = transactionRepository.save(transaction);

            return new TransferResult(
                    true,
                    savedTransaction.getId().toString(),
                    request.getAmount(),
                    fee,
                    request.getMessage() != null ? request.getMessage() : "",
                    null
            );


        } catch (Exception e) {
            throw new RuntimeException("Server is busy, please try again later", e);
        }
    }

    @Override
    public List<TransactionDto> getBankTransactions(String startDate, String endDate, int limit, int page) {
        if (limit <= 0 || page <= 0) {
            throw new IllegalArgumentException("Limit and page must be positive integers");
        }

        int pageNumber = page - 1;

        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        try {
            startDateTime = LocalDateTime.parse(startDate + "T00:00:00");
            endDateTime = LocalDateTime.parse(endDate + "T23:59:59");
            if (endDateTime.isBefore(startDateTime)) {
                throw new IllegalArgumentException("End date must be after start date");
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD, e.g., 2025-06-03");
        }

        Pageable pageable = PageRequest.of(pageNumber, limit);

        Page<Transaction> transactionPage = (Page<Transaction>) transactionRepository.findAll(pageable)
                .filter(t -> !t.getUpdatedAt().isBefore(Instant.from(startDateTime)) && !t.getUpdatedAt().isAfter(Instant.from(endDateTime)));

        return transactionPage.getContent().stream()
                .map(transaction -> new TransactionDto(
                        transaction.getId(),
                        transaction.getToBank().getId(),
                        transaction.getAmount(),
                        transaction.getUpdatedAt(),
                        transaction.getMessage()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public BankTransactionStatsDto getBankTransactionStats(UUID bankId, String startDate, String endDate) {
        if (bankId == null) {
            throw new IllegalArgumentException("Bank ID cannot be null");
        }

        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        try {
            startDateTime = LocalDateTime.parse(startDate + "T00:00:00"); // Bắt đầu ngày
            endDateTime = LocalDateTime.parse(endDate + "T23:59:59");   // Kết thúc ngày
            if (endDateTime.isBefore(startDateTime)) {
                throw new IllegalArgumentException("End date must be after start date");
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD, e.g., 2025-06-02");
        }
        List<Transaction> transactions = transactionRepository.findByBankIdAndDateRange(bankId, startDateTime, endDateTime);

        long totalTransactions = transactions.size();
        double totalAmount = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        return new BankTransactionStatsDto(totalTransactions, totalAmount, startDateTime, endDateTime);
    }

}