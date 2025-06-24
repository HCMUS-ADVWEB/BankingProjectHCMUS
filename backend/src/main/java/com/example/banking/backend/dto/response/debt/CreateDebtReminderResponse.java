package com.example.banking.backend.dto.response.debt;

import com.example.banking.backend.model.type.DebtStatusType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Data
@Schema(name = "CreateReminder",
        description = "Return created debt reminder information")
public class CreateDebtReminderResponse {
    @Schema(description = "Reminder's id",
            example = "ca1b8d49-ebe3-426c-adaf-130dde641fc6")
    private UUID id;

    @Schema(description = "Creator's id",
            example = "92edbffe-d9da-44e4-873b-43843306aed4")
    private UUID creatorId;

    @Schema(description = "Debtor's id",
            example = "92edbffe-d9da-44e4-873b-43843306aed4")
    private UUID debtorId;

    @Schema(description = "Debt's amount",
            example = "100000")
    private Double amount;

    @Schema(description = "Debt's message or note",
            example = "Pay me quickly!")
    private String message;

    @Schema(description = "Debt's status",
            example = "PENDING")
    private DebtStatusType status;
}