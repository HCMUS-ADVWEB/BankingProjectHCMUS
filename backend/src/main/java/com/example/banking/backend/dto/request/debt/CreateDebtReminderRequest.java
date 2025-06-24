package com.example.banking.backend.dto.request.debt;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Schema(description = "Request to create and send a debt reminder with this information")
public class CreateDebtReminderRequest {
    @NotBlank(message = "Debtor account number cannot be blank")
    @Schema(description = "Debtor's account number",
            example = "5873160242223846",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String debtorAccountNumber;  

    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be greater than 0")
    @Schema(description = "Debt's amount",
            example = "100000",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Double amount;  

    @NotBlank(message = "Message cannot be blank")
    @Schema(description = "Debt's message or note",
            example = "Pay me quickly",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String message;
}
