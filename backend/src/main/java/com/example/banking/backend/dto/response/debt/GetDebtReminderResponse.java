package com.example.banking.backend.dto.response.debt;

import com.example.banking.backend.model.type.DebtStatusType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Schema(name = "DebtReminder", description = "Debt reminder's information")
public class GetDebtReminderResponse {

    @Schema(description = "Reminder's id",
            example = "ca1b8d49-ebe3-426c-adaf-130dde641fc6")
    private UUID id;

    @Schema(description = "Creator's full name",
            example = "Nguyễn Văn A")
    private String creatorFullName;

    @Schema(description = "Debtor's full name",
            example = "Lê Thị B")
    private String debtorFullName;

    @Schema(description = "Creator's account number",
            example = "5873160242223846")
    private String creatorAccountNumber;

    @Schema(description = "Debtor's account number",
            example = "5873160242223846")
    private String debtorAccountNumber;

    @Schema(description = "Debt amount",
            example = "100000")
    private Double amount;

    @Schema(description = "Debt's message or note",
            example = "Pay me quickly")
    private String message;

    @Schema(description = "Debt's status",
            example = "PENDING")
    private DebtStatusType status;

    @Schema(description = "Debt create timestamp")
    private Instant createdAt;

    @Schema(description = "Debt update timestamp")
    private Instant updatedAt;

    @Schema(description = "Debt's cancel reason (if being cancelled)",
            example = "I'm rich")
    private String cancelledReason;

    @Schema(description = "Transaction's id if debt is paid",
            example = "c33af7e7-4bf1-4699-b4d6-0c42408a0247")
    private UUID transactionId;
}