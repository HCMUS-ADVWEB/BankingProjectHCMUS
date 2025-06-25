package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.dto.response.account.AccountInfoResult;
import com.example.banking.backend.dto.response.transaction.DepositResult;
import com.example.banking.backend.service.AccountService;
import com.example.banking.backend.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
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

    @Operation(tags = "🏧 Linked Bank"
            , summary = "[PUBLIC] Get FIN's account information"
            , description = "Other banks get a FIN's account information")
    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<AccountInfoResult>> processAccountInfo(
            @RequestBody AccountInfoRequest request,
            @Parameter(
                    description = "Unique code identifying the source bank making the request. Used to verify the requesting party.",
                    required = true,
                    in = ParameterIn.HEADER,
                    name = "Bank-Code"
            )
            @RequestHeader("Bank-Code") String sourceBankCode,

            @Parameter(
                    description = "Exact timestamp of the request in yyyy-MM-dd'T'HH:mm:ss format. Used to prevent replay attacks and ensure request freshness.",
                    required = true,
                    in = ParameterIn.HEADER,
                    name = "X-Timestamp"
            )
            @RequestHeader("X-Timestamp") String timestamp,

            @Parameter(
                    description = "HMAC-SHA256 hash signature of the request payload, computed with the pre-shared secret key. Used to verify request integrity and authenticity.",
                    required = true,
                    in = ParameterIn.HEADER,
                    name = "X-Request-Hash"
            )
            @RequestHeader("X-Request-Hash") String receivedHmac
    ) throws Exception {
        AccountInfoResult response = accountService.processAccountInfo(request, sourceBankCode, timestamp, receivedHmac);
        return ResponseEntity.ok(ApiResponse.<AccountInfoResult>builder()
                .status(HttpStatus.OK.value())
                .message("Account info processed successfully")
                .data(response)
                .build());
    }

    @Operation(tags = "🏧 Linked Bank"
            , summary = "[PUBLIC] Transfer money to FIN's account"
            , description = "Other banks transfer money to a FIN's account")
    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<DepositResult>> receiveInterbankTransfer(
            @RequestBody InterbankTransferRequest request,
            @Parameter(
                    description = "Unique code identifying the source bank making the request. Used to verify the requesting party.",
                    required = true,
                    in = ParameterIn.HEADER,
                    name = "Bank-Code"
            )
            @RequestHeader("Bank-Code") String sourceBankCode,

            @Parameter(
                    description = "Exact timestamp of the request in yyyy-MM-dd'T'HH:mm:ss format. Used to prevent replay attacks and ensure request freshness.",
                    required = true,
                    in = ParameterIn.HEADER,
                    name = "X-Timestamp"
            )
            @RequestHeader("X-Timestamp") String timestamp,

            @Parameter(
                    description = "HMAC-SHA256 hash signature of the request payload, computed with the pre-shared secret key. Used to verify request integrity and authenticity.",
                    required = true,
                    in = ParameterIn.HEADER,
                    name = "X-Request-Hash"
            )
            @RequestHeader("X-Request-Hash") String receivedHmac,
            @Parameter(
                    description = "HMAC-SHA256 digital signature of the request payload, generated using the pre-shared secret key between banks. Used to verify the request's integrity and authenticity.",
                    required = true,
                    in = ParameterIn.HEADER,
                    name = "X-Signature"
            )
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
