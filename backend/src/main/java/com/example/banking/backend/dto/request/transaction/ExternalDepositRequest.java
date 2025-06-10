package com.example.banking.backend.dto.request.transaction;

import com.example.banking.backend.model.type.FeeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ExternalDepositRequest {

    @NotBlank(message = "Account number cannot be blank")
    @NotNull(message = "Account number cannot be null")
    private String accountNumber;

    @NotNull(message = "Source bank ID cannot be null")
    private UUID sourceBankId;

    @Positive(message = "Amount must be positive")
    @NotNull(message = "Amount cannot be null")
    private Double amount;

    private String message;

    @NotNull(message = "Fee type cannot be null")
    private FeeType feeType;

    @NotBlank(message = "External transaction reference cannot be blank")
    private String externalTransactionRef;

    @NotBlank(message = "Sender name  cannot be blank")
    @NotNull(message = "Sender name cannot be null")
    private String senderName;
    @NotBlank(message = "Sender Account Number cannot be blank")
    @NotNull(message = "Sender Account Number cannot be null")
    private String senderAccountNumber;

    private String signature;
    private String hmac;
    private String timestamp;

}