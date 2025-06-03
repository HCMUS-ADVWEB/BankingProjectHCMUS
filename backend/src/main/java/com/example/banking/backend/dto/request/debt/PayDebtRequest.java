package com.example.banking.backend.dto.request.debt;

import lombok.Data;

import java.util.UUID;

@Data
public class PayDebtRequest {
    private String message;       // Optional message for payment
    private UUID transactionId;   // ID of the transaction associated with the payment
}