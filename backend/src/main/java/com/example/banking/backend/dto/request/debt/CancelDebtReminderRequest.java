package com.example.banking.backend.dto.request.debt;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Schema(description = "Request to cancel a debt reminder with this information")
public class CancelDebtReminderRequest {
    @NotBlank(message = "Cancelled reason must not be blank")
    @Schema(description = "Reason to cancel",
            example = "I'm rich",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String cancelledReason; // Reason for cancelling the debt reminder
}