package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequestExternal;
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
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
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

    public TransferResult externalTransfer(TransferRequestExternal request) throws Exception {
        Account sourceAccount = accountRepository.findByUserId(getCurrentUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("Source account not found"));
        if (sourceAccount.getBalance() < request.getAmount()) {
            return new TransferResult(false, null, request.getAmount(), 0.0, null, "Insufficient balance");
        }

        double fee = calculateFee(request.getAmount(), FeeType.valueOf(request.getFeeType()));
        double totalAmount = request.getAmount() + fee;

        if (sourceAccount.getBalance() < totalAmount) {
            return new TransferResult(false, null, request.getAmount(), fee, null, "Insufficient balance after fee");
        }
        otpService.validateOtp(
                getCurrentUser().getId(),
                OtpType.TRANSFER,
                request.getOtp()) ;
        Bank destinationBank = bankRepository.findByBankCode(request.getBankCode())
                .orElseThrow(() -> new IllegalArgumentException("Destination bank not found"));

        Account accountCurrentUser = getAccountCurrentUser();
        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.INTERBANK_TRANSFER);
        transaction.setFromBank(null);
        transaction.setFromAccount(accountCurrentUser);
        transaction.setFromAccountNumber(accountCurrentUser.getAccountNumber());
        transaction.setToBank(destinationBank);
        transaction.setToAccountNumber(request.getAccountNumberReceiver());
        transaction.setToAccount(getAccountFromNumber(request.getAccountNumberReceiver()));
        transaction.setAmount(request.getAmount());
        transaction.setFee(fee);
        transaction.setFeeType(FeeType.valueOf(request.getFeeType()));
        transaction.setMessage(request.getMessage() != null ? request.getMessage() : "");
        transaction.setStatus(TransactionStatusType.PENDING);


       String destinationApiUrl = destinationBank.getApiEndpoint();
        if (destinationApiUrl == null) {
            return new TransferResult(false, null, request.getAmount(), fee, null, "Destination bank API endpoint not configured");
        }

        TransactionRequestExternal externalRequest = new TransactionRequestExternal();
        externalRequest.setAccountNumberReceiver(request.getAccountNumberReceiver());
        externalRequest.setDestinationBankId(null);
        externalRequest.setAmount(request.getAmount());
        externalRequest.setFeeType(request.getFeeType());
        externalRequest.setMessage(request.getMessage());




        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> bankDetails = Map.of(
                "senderAccountNumber", sourceAccount.getAccountNumber(),
                "receiverAccountNumber", request.getAccountNumberReceiver(),
                "amount", request.getAmount(),
                "content", request.getMessage() != null ? request.getMessage() : ""
        );

        String body = objectMapper.writeValueAsString(bankDetails);
        String timestamp = Instant.now().toString();
        String bankCode = "FIN";
        String secretKey = destinationBank.getSecretKey();

        String hashInput = body + timestamp + bankCode + secretKey;
        String hmac = CryptoUtils.generateHMAC(hashInput, secretKey); // HmacSHA256

        String signature = CryptoUtils.signData(body, nhom3privateKey);

        externalRequest.setSignature(signature);
        externalRequest.setHmac(hmac);
        Transaction savedTransaction = transactionRepository.save(transaction);

        try {
            ResponseEntity<TransferResult> response = restTemplate.postForEntity(
                    destinationApiUrl + "/api/transactions",
                    externalRequest,
                    TransferResult.class
            );
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null && response.getBody().isSuccess()) {
                sourceAccount.setBalance(sourceAccount.getBalance() - totalAmount);
                accountRepository.save(sourceAccount);
                return new TransferResult(
                        true,
                        savedTransaction.getId().toString(),
                        request.getAmount(),
                        fee,
                        request.getMessage() != null ? request.getMessage() : "",
                        null
                );
            } else {
                transactionRepository.delete(savedTransaction); // Rollback nếu thất bại
                return new TransferResult(false, null, request.getAmount(), fee, null, "External transfer failed: " + response.getBody().getErrorMessage());
            }
        } catch (Exception e) {
            transactionRepository.delete(savedTransaction); // Rollback
            return new TransferResult(false, null, request.getAmount(), fee, null, "External transfer failed: " + e.getMessage());
        }
    }


    public DepositResult externalDeposit(ExternalDepositRequest request) throws Exception {
        if (request == null) {
            return new DepositResult(false, null, 0.0, 0.0, null, "Deposit request cannot be null");
        }

        // Kiểm tra đầu vào
        if (request.getAmount() <= 0) {
            return new DepositResult(false, null, request.getAmount(), 0.0, null, "Invalid amount");
        }

        Account destinationAccount = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Destination account not found: " + request.getAccountNumber()));

        Bank sourceBank = bankRepository.findById(request.getSourceBankId())
                .orElseThrow(() -> new IllegalArgumentException("Source bank not found"));

        String dataToHash = request.getAccountNumber() + request.getAmount() + request.getTimestamp();
        String calculatedHmac = CryptoUtils.generateHMAC(dataToHash, sourceBank.getSecretKey());
        if (!calculatedHmac.equals(request.getHmac())) {
            return new DepositResult(false, null, request.getAmount(), 0.0, null, "Packet integrity compromised");
        }

        PublicKey sourcePublicKey = CryptoUtils.loadPublicKey(sourceBank.getPublicKey());
        if (sourcePublicKey == null || !CryptoUtils.verifySignature(dataToHash, request.getSignature(), sourcePublicKey)) {
            return new DepositResult(false, null, request.getAmount(), 0.0, null, "Invalid signature from source bank");
        }

        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setFromBank(sourceBank);
        transaction.setFromAccount(null);
        transaction.setFromAccountNumber(request.getSenderAccountNumber());
        transaction.setToBank(null);
        transaction.setToAccount(destinationAccount);
        transaction.setToAccountNumber(request.getAccountNumber());
        transaction.setAmount(request.getAmount());
        transaction.setFee(0.0);
        transaction.setFeeType(null);
        transaction.setMessage(request.getMessage() != null ? request.getMessage() : "External deposit from " + sourceBank.getBankName());
        transaction.setStatus(TransactionStatusType.PENDING);

        Transaction savedTransaction = transactionRepository.save(transaction);

        double oldBalance = destinationAccount.getBalance();
        double newBalance = oldBalance + request.getAmount();
        destinationAccount.setBalance(newBalance);
        accountRepository.save(destinationAccount);

        String sourceApiUrl = sourceBank.getApiEndpoint();
        if (sourceApiUrl != null) {
            try {
                TransactionResponse response = new TransactionResponse();
                response.setTransactionId(savedTransaction.getId());
                response.setTargetAccountId(String.valueOf(destinationAccount.getAccountId()));
                response.setAmount(request.getAmount());
                response.setTimestamp(Instant.now().toString());
                String responseData = response.getTransactionId() + response.getTargetAccountId() + response.getAmount() + response.getTimestamp();
                response.setSignature(CryptoUtils.signData(responseData, nhom3privateKey));
                restTemplate.postForEntity(sourceApiUrl + "/api/confirm", response, Void.class);
                savedTransaction.setStatus(TransactionStatusType.COMPLETED);
                transactionRepository.save(savedTransaction);
            } catch (Exception e) {
                // Rollback nếu gửi xác nhận thất bại
                destinationAccount.setBalance(oldBalance);
                accountRepository.save(destinationAccount);
                transactionRepository.delete(savedTransaction);
                return new DepositResult(false, null, request.getAmount(), 0.0, null, "Failed to confirm with source bank: " + e.getMessage());
            }
        } else {
            // Nếu không có API endpoint, vẫn hoàn tất nhưng ghi log cảnh báo
            savedTransaction.setStatus(TransactionStatusType.COMPLETED);
            transactionRepository.save(savedTransaction);
        }

        return new DepositResult(
                true,
                savedTransaction.getId().toString(),
                request.getAmount(),
                newBalance,
                "External deposit completed successfully from " + sourceBank.getBankName(),
                ""
        );
    }

    @Override
    public ExternalAccountDto ExternalAccountReturn() {
        return null;
    }

    private double calculateFee(double amount, FeeType feeType) {
        if (feeType == null) {
            return 0.0; // Mặc định không phí nếu không chỉ định
        }
        return switch (feeType) {
            case SENDER -> 10.0; // Phí cố định 10 đơn vị
            case RECEIVER -> amount * 0.01; // Phí 1% của số tiền
            default -> 0.0;
        };
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
            Transaction transaction = new Transaction();

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
                    request.getOtp()) ;
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