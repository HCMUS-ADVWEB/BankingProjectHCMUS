package com.example.banking.backend.dto.request.debt;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateDebtReminderRequest {
    @NotBlank(message = "Debtor account number cannot be blank")
    private String debtorAccountNumber;  

    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be greater than 0")
    private Double amount;  

    @NotBlank(message = "Message cannot be blank")
    private String message;
}
