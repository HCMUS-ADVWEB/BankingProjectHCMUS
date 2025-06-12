package com.example.banking.backend.dto.response.transaction;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TransactionDto {
    private UUID id;
    private UUID bankId;
    private double amount;
    private Instant transactionDate;
    private String message;


}