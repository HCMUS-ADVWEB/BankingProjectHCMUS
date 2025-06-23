package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.response.account.AccountInfoResponse;
import com.example.banking.backend.dto.response.transaction.DepositResult;
import com.example.banking.backend.service.AccountService;
import com.example.banking.backend.service.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/linked-banks")
@AllArgsConstructor
public class LinkBankController {

    AccountService accountService;
    TransactionService transactionService;

    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<AccountInfoResponse>> processAccountInfo(
            @RequestBody AccountInfoRequest request,
            @RequestHeader("Bank-Code") String sourceBankCode,
            @RequestHeader("X-Timestamp") String timestamp,
            @RequestHeader("X-Request-Hash") String receivedHmac
    ) throws Exception {
        AccountInfoResponse response = accountService.processAccountInfo(request, sourceBankCode, timestamp, receivedHmac);
        return ResponseEntity.ok(ApiResponse.<AccountInfoResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Account info processed successfully")
                .data(response)
                .build());
    }
    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<DepositResult>> receiveInterbankTransfer(
            @RequestBody InterbankTransferRequest request,
            @RequestHeader("Bank-Code") String sourceBankCode,
            @RequestHeader("X-Timestamp") String timestamp,
            @RequestHeader("X-Request-Hash") String receivedHmac,
            @RequestHeader("X-Signature") String signature) throws Exception {

        DepositResult depositResult = transactionService.externalDeposit(request, sourceBankCode,
                timestamp, receivedHmac, signature);

        return ResponseEntity.ok(ApiResponse.<DepositResult>builder()
                .status(HttpStatus.OK.value())
                .message("External deposit initiated successfully")
                .data(depositResult)
                .build());

    }
}
