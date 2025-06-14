package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.transaction.ExternalDepositRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequestExternal;
import com.example.banking.backend.dto.response.transaction.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TransactionService {

    TransferResult internalTransfer(TransferRequest request);

    TransferResult externalTransfer(TransferRequestExternal request) throws Exception;

    void verifyTransferOtp(VerifyOtpRequest request);


    List<TransactionDto> getBankTransactions(String startDate, String endDate, int limit, int page);

    BankTransactionStatsDto getBankTransactionStats(UUID bankId, String startDate, String endDate);

    public AccountDto getExternalAccountInfo(String accountNumber , UUID bankId);

    DepositResult externalDeposit(ExternalDepositRequest request) throws Exception;
}
