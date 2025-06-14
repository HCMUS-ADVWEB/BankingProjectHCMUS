package com.example.banking.backend.dto.request.transaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Data
@Getter
@Setter
public class TransferRequestExternal {

    @NotBlank(message = "Receiver account number cannot be null or empty")
    private String accountNumberReceiver;

    @NotNull(message = "Destination bank ID cannot be null")
    private UUID destinationBankId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotBlank(message = "Fee type cannot be null or empty")
    private String feeType;

    private String message; // optional
}