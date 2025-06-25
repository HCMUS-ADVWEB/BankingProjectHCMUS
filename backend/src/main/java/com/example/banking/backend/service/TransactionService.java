package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.request.transaction.InternalDeposit;
import com.example.banking.backend.dto.request.transaction.TransferExternalRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.response.transaction.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TransactionService {

    TransferResult internalTransfer(TransferRequest request);

    TransferResult externalTransfer(TransferExternalRequest request) throws Exception;

    List<TransactionDto> getBankTransactions(String startDate, String endDate, int limit, int page, String bankCode);

    BankTransactionStatsDto getBankTransactionStats(String startDate, String endDate, String bankCode);

    DepositResult externalDeposit(InterbankTransferRequest request, String sourceBankCode,
                                  String timestamp, String receivedHmac, String signature) throws Exception;

    InternalDepositResult internalDeposit(InternalDeposit internalDeposit);
}
