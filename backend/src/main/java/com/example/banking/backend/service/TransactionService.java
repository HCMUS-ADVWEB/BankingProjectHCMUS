package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.transaction.AddRecipientRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;

import java.util.UUID;

public interface TransactionService {

    void internalTransfer(TransferRequest request);

    void externalTransfer(TransferRequest request);

    void verifyTransferOtp(VerifyOtpRequest request);

    void getTransactionHistory(UUID accountId, int limit, int page);

    void getRecipients(int limit, int page);

    void addRecipient(AddRecipientRequest request);

    void updateRecipient(UUID recipientId, AddRecipientRequest request);

    void deleteRecipient(UUID recipientId);

    void verifyRecipient(String accountNumber, UUID bankId);

    void getBankTransactions(UUID bankId, String startDate, String endDate, int limit, int page);

    void getBankTransactionStats(UUID bankId, String startDate, String endDate);

    void getExternalAccountInfo(String accountNumber);

    void externalDeposit(ExternalDepositRequest request);
}
