package com.example.banking.backend.dto.response.debt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtReminderListsResponse {
    private List<GetDebtReminderResponse> createdDebts;
    private List<GetDebtReminderResponse> receivedDebts;
}
