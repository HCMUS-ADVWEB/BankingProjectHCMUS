package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.VerifyOtpRequest;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.transaction.*;
import com.example.banking.backend.dto.response.account.AccountDto;
import com.example.banking.backend.dto.response.account.ExternalAccountDto;
import com.example.banking.backend.dto.response.transaction.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TransactionService {

    TransferResult internalTransfer(TransferRequest request);

    TransferResult externalTransfer(TransferExternalRequest request) throws Exception;

    List<TransactionDto> getBankTransactions(String startDate, String endDate, int limit, int page);

    BankTransactionStatsDto getBankTransactionStats(String startDate, String endDate);

    DepositResult externalDeposit(InterbankTransferRequest request ,String sourceBankCode ,
                                  String timestamp, String receivedHmac , String signature) throws Exception;

    InternalDepositResult internalDeposit(InternalDeposit internalDeposit);
}
