package com.example.banking.backend.dto.request.debt;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CancelDebtReminderRequest {
    @NotBlank(message = "Cancelled reason must not be blank")
    private String cancelledReason; // Reason for cancelling the debt reminder
}