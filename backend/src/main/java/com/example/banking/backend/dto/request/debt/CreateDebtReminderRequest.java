package com.example.banking.backend.dto.request.debt;

import java.util.UUID;

import com.example.banking.backend.model.type.DebtStatusType;

import lombok.Data;

@Data
public class CreateDebtReminderRequest {
    private UUID debtorId;  // ID of the debtor
    private Double amount;  // Amount of the debt
    private String message; // Optional message for the debt reminder
}
