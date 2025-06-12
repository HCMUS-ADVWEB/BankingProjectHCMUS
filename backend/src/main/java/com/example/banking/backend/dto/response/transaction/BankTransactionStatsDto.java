package com.example.banking.backend.dto.response.transaction;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor

public class BankTransactionStatsDto {
    private long totalTransactions;
    private double totalAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;


}