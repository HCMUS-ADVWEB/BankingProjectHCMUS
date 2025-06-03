package com.example.banking.backend.mapper.debtReminder;

import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.model.DebtReminder;
import org.springframework.stereotype.Component;

@Component
public class DebtReminderMapper {
    public GetDebtReminderResponse toResponse(DebtReminder debtReminder) {
        GetDebtReminderResponse response = new GetDebtReminderResponse();
        response.setId(debtReminder.getId());
        response.setCreatorId(debtReminder.getCreator().getId());
        response.setDebtorId(debtReminder.getDebtor().getId());
        response.setAmount(debtReminder.getAmount());
        response.setMessage(debtReminder.getMessage());
        response.setStatus(debtReminder.getStatus());
        response.setCreatedAt(debtReminder.getCreatedAt());
        response.setUpdatedAt(debtReminder.getUpdatedAt());
        response.setCancelledReason(debtReminder.getCancelledReason()); // Can be null
        response.setTransactionId(debtReminder.getTransaction() != null ? debtReminder.getTransaction().getId() : null); // Handle null transaction
        return response;
    }
}