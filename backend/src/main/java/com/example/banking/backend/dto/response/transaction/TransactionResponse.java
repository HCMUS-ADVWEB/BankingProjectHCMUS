package com.example.banking.backend.dto.response.transaction;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class TransactionResponse {
    private UUID transactionId;
    private String targetAccountId;
    private Double amount;
    private String timestamp;
    private String signature; // Chữ ký RSA của A
}