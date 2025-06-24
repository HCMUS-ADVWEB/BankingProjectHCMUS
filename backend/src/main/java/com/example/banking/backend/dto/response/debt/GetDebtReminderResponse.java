package com.example.banking.backend.dto.response.debt;

import com.example.banking.backend.model.type.DebtStatusType;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class GetDebtReminderResponse {
    private UUID id;
    private String creatorFullName;
    private String debtorFullName;
    private String creatorAccountNumber;
    private String debtorAccountNumber;
    private Double amount;
    private String message;
    private DebtStatusType status;
    private Instant createdAt;
    private Instant updatedAt;
    private String cancelledReason;
    private UUID transactionId;
}