package com.example.banking.backend.dto.request.debt;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDebtReminderRequest {
    @NotNull(message = "Debtor ID cannot be null")
    private UUID debtorId;  // ID of the debtor

    @NotNull(message = "Amount cannot be null")
    @Min(value = 0, message = "Amount must be greater than or equal to 0")
    private Double amount;  // Amount of the debt

    @NotBlank(message = "Message cannot be blank")
    private String message; // Optional message for the debt reminder
}
