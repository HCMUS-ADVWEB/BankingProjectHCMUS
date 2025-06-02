package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.AddRecipientRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequestExternal;
import com.example.banking.backend.dto.response.transaction.*;
import com.example.banking.backend.exception.InvalidUserException;
import com.example.banking.backend.model.*;
import com.example.banking.backend.model.type.FeeType;
import com.example.banking.backend.model.type.TransactionStatusType;
import com.example.banking.backend.model.type.TransactionType;
import com.example.banking.backend.repository.*;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class TransactionServiceImpl implements TransactionService {


    private TransactionRepository  transactionRepository;
    private AccountRepository accountRepository ;
    private BankRepository  bankRepository;
    private UserRepository  userRepository;
    private RecipientRepository  recipientRepository;

    @Override
    public TransferResult externalTransfer(TransferRequestExternal request) {
        if (request == null) {
            return new TransferResult(false, null, 0.0, 0.0, null, "Transfer request cannot be null");
        }
        if (request.getAccountNumberReceiver() == null || request.getAccountNumberReceiver().trim().isEmpty()) {
            return new TransferResult(false, null, 0.0, 0.0, null, "Receiver account number cannot be null or empty");
        }
        if (request.getDestinationBankId() == null) {
            return new TransferResult(false, null, 0.0, 0.0, null, "Destination bank ID cannot be null");
        }
        if (request.getAmount() <= 0) {
            return new TransferResult(false, null, 0.0, 0.0, null, "Amount must be positive");
        }


        Account sourceAccount = accountRepository.findByUserId(getCurrentUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("Source account not found"));
        if (sourceAccount.getBalance() < request.getAmount()) {
            return new TransferResult(false, null, request.getAmount(), 0.0, null, "Insufficient balance");
        }

        double fee = calculateFee(request.getAmount(), request.getFeeType());
        double totalAmount = request.getAmount() + fee;

        if (sourceAccount.getBalance() < totalAmount) {
            return new TransferResult(false, null, request.getAmount(), fee, null, "Insufficient balance after fee");
        }
        Bank bank = bankRepository.findById(request.getDestinationBankId()).orElseThrow(
                () -> new IllegalArgumentException("No bank")
        ) ;
        Account accountCurrentUser = getAccountCurrentUser();

        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.INTERBANK_TRANSFER);
        transaction.setFromBank(null);
        transaction.setFromAccount(accountCurrentUser);
        transaction.setFromAccountNumber(accountCurrentUser.getAccountNumber());

        transaction.setToBank(bank);
        transaction.setToAccountNumber(request.getAccountNumberReceiver());
        transaction.setToAccount(getAccountFromNumber(request.getAccountNumberReceiver()));

        transaction.setAmount(request.getAmount());
        transaction.setFee(request.getAmount()*0.02);
        transaction.setFeeType(request.getFeeType());

        transaction.setMessage(request.getMessage() != null ? request.getMessage() : "");
        transaction.setStatus(TransactionStatusType.PENDING);

        Transaction savedTransaction = transactionRepository.save(transaction);

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
    }

    private double calculateFee(double amount, FeeType feeType) {
        if (feeType == null) {
            return 0.0; // Mặc định không phí nếu không chỉ định
        }
        return switch (feeType) {
            case FIXED -> 10.0; // Phí cố định 10 đơn vị
            case PERCENTAGE -> amount * 0.01; // Phí 1% của số tiền
            default -> 0.0;
        };
    }

    Account getAccountCurrentUser() {
        return accountRepository.findByUserId(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("NOT FOUND "));
    }
    Account getAccountFromNumber(String accountNumber) {
        return  accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("NOT FOUND"));
    }
    User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("NOT FOUND"));
    }

    @Override
    public TransferResult internalTransfer(TransferRequest request) {

        Transaction transaction = new Transaction();

        Account accountCurrentUser = getAccountCurrentUser();

        transaction.setTransactionType(TransactionType.INTERNAL_TRANSFER);

        transaction.setFromBank(null);
        transaction.setFromAccount(accountCurrentUser);
        transaction.setFromAccountNumber(accountCurrentUser.getAccountNumber());

        transaction.setToBank(null);
        transaction.setToAccountNumber(request.getAccountNumberReceiver());
        transaction.setToAccount(getAccountFromNumber(request.getAccountNumberReceiver()));

        transaction.setAmount(request.getAmount());
        transaction.setFee(request.getAmount()*0.02);
        transaction.setFeeType(request.getFeeType());
        transaction.setStatus(TransactionStatusType.PENDING);
        transaction.setMessage(request.getMessage());

        var savedTransaction = transactionRepository.save(transaction);
        double fee = calculateFee(request.getAmount(), request.getFeeType());

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
    public void verifyTransferOtp(VerifyOtpRequest request) {

    }

    @Override
    public List<TransactionDto> getTransactionHistory(UUID accountId, int limit, int page) {
        if (accountId == null) {
            throw new IllegalArgumentException("Account ID cannot be null");
        }
        if (limit <= 0 || page <= 0) {
            throw new IllegalArgumentException("Limit and page must be positive integers");
        }

        int pageNumber = page - 1;

        Pageable pageable = PageRequest.of(pageNumber, limit);

        Page<Transaction> transactionPage = transactionRepository.findByAccountId(accountId, pageable);

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
    public void addRecipient(AddRecipientRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new InvalidUserException("NOT FOUND THIS ACCOUNT"));
        Bank bank = bankRepository.findByBankName(request.getBankName())
                .orElseThrow(() -> new InvalidUserException("NOT FOUND THIS ACCOUNT"));
        Recipient recipient = new Recipient();
        User currentUser = getCurrentUser() ;
        recipient.setUser(currentUser);
        recipient.setRecipientAccountNumber(request.getAccountNumber());
        recipient.setRecipientName(account.getUser().getFullName());
        recipient.setBank(bank);
        currentUser.getRecipients().add(recipient);
        userRepository.save(currentUser);
    }

    @Override
    public void deleteRecipient(String recipientFullName, String recipientAccountNumber, String bankName) {
        User currentUser = getCurrentUser();
        Recipient recipient = currentUser.getRecipients().stream()
                .filter(r -> r.getRecipientName().equals(recipientFullName) &&
                        r.getRecipientAccountNumber().equals(recipientAccountNumber) &&
                        r.getBank().getBankName().equals(bankName))
                .findFirst()
                .orElseThrow(() -> new InvalidUserException("Recipient not found"));

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
            startDateTime = LocalDateTime.parse(startDate + "T00:00:00"); // Bắt đầu ngày
            endDateTime = LocalDateTime.parse(endDate + "T23:59:59");   // Kết thúc ngày
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

    @Override
    public AccountDto getExternalAccountInfo(String accountNumber , UUID bankId) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Account number cannot be null or empty");
        }
        if (bankId == null) {
            throw new IllegalArgumentException("Bank ID cannot be null");
        }
        Optional<Bank> bank = bankRepository.findById(bankId);
        if (bank.isEmpty()) throw new IllegalArgumentException("Bank ID cannot be null");


        Account account = accountRepository.findByAccountNumberAndBankId(accountNumber, bankId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found for accountNumber: " + accountNumber + " and bankId: " + bankId));


        return new AccountDto(
                account.getId(),
                account.getAccountNumber(),
                bank.get().getBankName(),
                account.getUser().getFullName()
        );
    }


    @Override
    public void externalDeposit(ExternalDepositRequest request) {

    }

    @Override
    public boolean verifyRecipient(String accountNumber, UUID bankId) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Account number cannot be null or empty");
        }
        if (bankId == null) {
            throw new IllegalArgumentException("Bank ID cannot be null");
        }

        Account account = accountRepository.findByAccountNumberAndBankId(accountNumber, bankId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Recipient verification failed: Account not found for accountNumber: " + accountNumber + " and bankId: " + bankId
                ));

        return true;

    }


    @Override
    public void updateRecipient(UUID recipientId, AddRecipientRequest request) {
        Recipient recipient = recipientRepository.findById(recipientId)
                .orElseThrow(() -> new InvalidUserException("Recipient not found"));

        Bank bank = bankRepository.findByBankName(request.getBankName())
                .orElseThrow(() -> new InvalidUserException("Bank not found"));

        recipient.setBank(bank);
        recipient.setRecipientAccountNumber(request.getAccountNumber());

        recipientRepository.save(recipient);
    }

    @Override
    public List<RecipientDtoResponse> getRecipients(int limit, int page) {
        int pageNumber = page - 1;

        if (limit <= 0 || pageNumber < 0) {
            throw new IllegalArgumentException("Limit must be positive and page must be 1 or greater");
        }

        Pageable pageable = PageRequest.of(pageNumber, limit);

        Page<Recipient> recipientPage = recipientRepository.findAll(pageable);

        return recipientPage.getContent().stream()
                .map(recipient -> new RecipientDtoResponse(
                        recipient.getId(),
                        recipient.getRecipientAccountNumber(),
                        recipient.getBank().getBankName(),
                        recipient.getRecipientName()
                ))
                .collect(Collectors.toList());
    }
}
