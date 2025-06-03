package com.example.banking.backend.dto.request.debt;

import lombok.Data;

@Data
public class CancelDebtReminderRequest {
    private String cancelledReason; // Reason for cancelling the debt reminder
}