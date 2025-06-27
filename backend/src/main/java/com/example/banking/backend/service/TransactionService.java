package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.request.transaction.InternalDeposit;
import com.example.banking.backend.dto.request.transaction.TransferExternalRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.response.transaction.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface TransactionService {

    TransferResult internalTransfer(TransferRequest request ,  Boolean needToCheckOtp);

    TransferResult externalTransfer(TransferExternalRequest request) throws Exception;

    BankTransactionDto getBankTransactions(String startDate, String endDate, int limit, int page, String bankCode);

    BankTransactionStatsDto getBankTransactionStats(String startDate, String endDate, String bankCode);

    DepositResult externalDeposit(InterbankTransferRequest request, String sourceBankCode,
                                  String timestamp, String receivedHmac, String signature) throws Exception;

    InternalDepositResult internalDeposit(InternalDeposit internalDeposit);
}
