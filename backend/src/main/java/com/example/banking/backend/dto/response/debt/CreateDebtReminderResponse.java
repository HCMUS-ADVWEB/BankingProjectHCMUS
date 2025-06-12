package com.example.banking.backend.dto.response.debt;

import lombok.Data;

import java.util.UUID;


@Data
public class CreateDebtReminderResponse {
    private UUID id;               // ID of the created debt reminder
    private UUID creatorId;        // ID of the user who created the reminder
    private UUID debtorId;         // ID of the debtor
    private Double amount;    // Amount of the debt
    private String message;        // Optional message for the debt reminder
    private String status;         // Status of the debt reminder (e.g., PENDING, COMPLETED)
}