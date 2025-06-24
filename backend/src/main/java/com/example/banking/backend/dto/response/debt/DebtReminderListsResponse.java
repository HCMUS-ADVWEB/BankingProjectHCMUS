package com.example.banking.backend.dto.response.debt;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "ReminderList", description = "Split reminders into 2 list: created reminders and received reminders")
public class DebtReminderListsResponse {
    @Schema(description = "Created reminders")
    private List<GetDebtReminderResponse> createdDebts;

    @Schema(description = "Received reminders")
    private List<GetDebtReminderResponse> receivedDebts;
}
