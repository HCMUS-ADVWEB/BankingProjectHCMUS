package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.AddRecipientRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequestExternal;
import com.example.banking.backend.dto.response.account.AccountDto;
import com.example.banking.backend.dto.response.transaction.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TransactionService {

    TransferResult internalTransfer(TransferRequest request);

    TransferResult externalTransfer(TransferRequestExternal request);

    void verifyTransferOtp(VerifyOtpRequest request);

    List<TransactionDto> getTransactionHistory(UUID accountId, int limit, int page);

    List<RecipientDtoResponse> getRecipients(int limit, int page);

    void addRecipient(AddRecipientRequest request);

    void updateRecipient(UUID recipientId, AddRecipientRequest request);

    void deleteRecipient(String recipientFullName, String recipientAccountNumber, String bankName);

    boolean verifyRecipient(String accountNumber, UUID bankId);

    List<TransactionDto> getBankTransactions(String startDate, String endDate, int limit, int page);

    BankTransactionStatsDto getBankTransactionStats(UUID bankId, String startDate, String endDate);

    public AccountDto getExternalAccountInfo(String accountNumber , UUID bankId);

    DepositResult externalDeposit(ExternalDepositRequest request);
}
