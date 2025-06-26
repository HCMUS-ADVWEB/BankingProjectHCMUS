package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.request.transaction.InternalDeposit;
import com.example.banking.backend.dto.request.transaction.TransferExternalRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Bank;
import com.example.banking.backend.model.Transaction;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.FeeType;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.model.type.TransactionStatusType;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.repository.BankRepository;
import com.example.banking.backend.repository.TransactionRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.repository.account.AccountRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.util.CryptoUtils;
import com.example.banking.backend.util.SignatureUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.security.PublicKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private TransactionRepository transactionRepository;
    private AccountRepository accountRepository;
    private BankRepository bankRepository;
    private UserRepository userRepository;
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
        transaction.setFeeType(FeeType.fromValue(request.getFeeType())); // Giả sử phí do người gửi trả);
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
            Account accountCurrentUser = getAccountCurrentUser();

            try {
                Transaction transaction = new Transaction();
                transaction.setTransactionType(TransactionType.INTERBANK_TRANSFER);
                transaction.setFromAccount(accountCurrentUser);
                transaction.setFromAccountNumber(accountCurrentUser.getAccountNumber());
                transaction.setToAccountNumber(request.getReceiverAccountNumber());
                transaction.setToAccount(null);
                transaction.setAmount(request.getAmount());
                transaction.setFee(fee);
                transaction.setFeeType(FeeType.fromValue(request.getFeeType()));
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
                    String myBankCode = "FIN";
                    String timestamp = String.valueOf(Instant.now().toEpochMilli());
                    String requestBodyToSign = interbankRequest.toString();
                    String hashInput = requestBodyToSign + timestamp + myBankCode + destinationBank.getSecretKey();
                    String hmac = CryptoUtils.generateHMAC(hashInput, destinationBank.getSecretKey());
                    String signature = SignatureUtil.signData(interbankRequest);

                    // Setup headers
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    headers.set("Bank-Code", myBankCode);
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
                    if (response.getStatusCode() == HttpStatus.OK) {
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
        if (!SignatureUtil.isTimestampWithin5Minutes(timestamp)) throw new BadRequestException("Expired ,do it again");
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
        transaction.setFeeType(FeeType.SENDER);
        transaction.setMessage(request.getContent() != null ? request.getContent() :
                "Interbank transfer from " + sourceBank.getBankName());
        transaction.setStatus(TransactionStatusType.COMPLETED);
        Instant now = Instant.now();
        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);
        Transaction savedTransaction = transactionRepository.save(transaction);
        double oldBalance = destinationAccount.getBalance();
        double newBalance = oldBalance + request.getAmount();
        destinationAccount.setBalance(newBalance);
        accountRepository.save(destinationAccount);

        return new DepositResult(
                "Transfer completed successfully"
        );
    }

    @Override
    public InternalDepositResult internalDeposit(InternalDeposit internalDeposit) {
        Account toAccount = getAccountFromNumber(internalDeposit.getAccountNumberReceiver());

        if (toAccount == null) {
            throw new BadRequestException("Receiver account not found");
        }


        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setFromAccount(null);
        transaction.setFromAccountNumber(null);
        transaction.setToAccountNumber(toAccount.getAccountNumber());
        transaction.setToAccount(toAccount);
        transaction.setAmount(internalDeposit.getAmount());
        transaction.setFee(0.0);
        transaction.setFeeType(FeeType.SENDER); // Assuming sender pays the fee
        transaction.setStatus(TransactionStatusType.COMPLETED);
        transaction.setMessage("EMPLOYEE INTERNAL DEPOSIT");

        // Set timestamps manually
        Instant now = Instant.now();
        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);
        // Save transaction
        var savedTransaction = transactionRepository.save(transaction);


        toAccount.setBalance(toAccount.getBalance() + internalDeposit.getAmount());
        accountRepository.save(toAccount);

        // Update transaction status to COMPLETED
        savedTransaction.setUpdatedAt(Instant.now());
        savedTransaction = transactionRepository.save(savedTransaction);

        return new InternalDepositResult(true);
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

        // Validate OTP if provided
        if (request.getOtp() != null && !request.getOtp().isEmpty()) {
            if (!otpService.validateOtp(
                    getCurrentUser().getId(),
                    OtpType.TRANSFER,
                    request.getOtp())) throw new BadRequestException("Invalid OTP");
        } else {
            throw new BadRequestException("OTP is required for internal transfer");
        }

        // Save transaction
        var savedTransaction = transactionRepository.save(transaction);

        // Update account balances
        accountCurrentUser.setBalance(accountCurrentUser.getBalance() - totalAmount);
        accountRepository.save(accountCurrentUser);

        toAccount.setBalance(toAccount.getBalance() + request.getAmount());
        accountRepository.save(toAccount);

        // Update transaction status to COMPLETED
        savedTransaction.setStatus(TransactionStatusType.COMPLETED);
        savedTransaction.setUpdatedAt(Instant.now());
        savedTransaction = transactionRepository.save(savedTransaction);

        return new TransferResult(
                true,
                savedTransaction.getId().toString(),
                request.getAmount(),
                fee,
                request.getMessage() != null ? request.getMessage() : "",
                null
        );
    }

    @Override
    public BankTransactionDto getBankTransactions(String startDate, String endDate, int limit, int page, String bankCode) {
        if (limit <= 0 || page <= 0) {
            throw new IllegalArgumentException("Limit and page must be positive integers");
        }
        int pageNumber = page - 1;
        LocalDateTime startDateTime;
        LocalDateTime endDateTime;
        try {
            startDateTime = LocalDateTime.parse(startDate + "T00:00:00"); // Bắt đầu ngày
            endDateTime = LocalDateTime.parse(endDate + "T23:59:59");   // Kết thúc ngày
            if (endDateTime.isBefore(startDateTime)) {
                throw new IllegalArgumentException("End date must be after start date");
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO format, e.g., 2025-06-24T00:00:00");
        }
        Pageable pageable = PageRequest.of(pageNumber, limit);
        Instant startInstant = startDateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
        Instant endInstant = endDateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
        Page<Transaction> transactionPage = bankCode == null ?
                transactionRepository.findByUpdatedAtBetween(startInstant, endInstant, pageable)
                : transactionRepository.findByUpdatedAtBetweenAndBankCode(
                startInstant, endInstant, bankCode, pageable);

        List<TransactionDto> transactionDtos = transactionPage.getContent().stream()
                .map(transaction -> new TransactionDto(
                        transaction.getId().toString(),
                        transaction.getFromBank() == null ? null : transaction.getFromBank().getBankCode(),
                        transaction.getToBank() != null ? transaction.getToBank().getBankName() : null,
                        transaction.getAmount(),
                        transaction.getUpdatedAt(),
                        transaction.getMessage()
                ))
                .collect(Collectors.toList());

        return new BankTransactionDto(
                transactionDtos,
                transactionPage.getTotalPages(),
                transactionPage.getNumber() + 1,
                transactionPage.getSize(),
                transactionPage.getNumberOfElements(),
                (int) transactionPage.getTotalElements());

    }

    @Override
    public BankTransactionStatsDto getBankTransactionStats(String startDate, String endDate, String bankCode) {


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
        Instant startInstant = startDateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
        Instant endInstant = endDateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();

        List<Transaction> transactions = bankCode == null ?
                transactionRepository.findByUpdatedAtBetween(
                        startInstant, endInstant) :
                transactionRepository.findByBankCodeAndUpdatedAtBetween(
                        startInstant, endInstant, bankCode);

        long totalTransactions = transactions.size();
        double totalAmount = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        return new BankTransactionStatsDto(totalTransactions, totalAmount, startDateTime, endDateTime, bankCode);
    }


}