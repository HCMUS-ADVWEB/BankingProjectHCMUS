package com.example.banking.backend.mapper.debtReminder;

import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.model.DebtReminder;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DebtReminderMapper {
    public GetDebtReminderResponse toResponse(DebtReminder debtReminder) {
        GetDebtReminderResponse response = new GetDebtReminderResponse();
        response.setId(debtReminder.getId());

        UUID currentUserId = CustomContextHolder.getCurrentUserId();
        boolean isCreator = debtReminder.getCreator().getId().equals(currentUserId);

        if (isCreator) {
            // If current user is creator, show debtor's full name and account number
            response.setDebtorFullName(debtReminder.getDebtor().getFullName());
            if (debtReminder.getDebtor().getAccount() != null) {
                response.setDebtorAccountNumber(debtReminder.getDebtor().getAccount().getAccountNumber());
            }
        } else {
            // If current user is debtor, show creator's full name and account number
            response.setCreatorFullName(debtReminder.getCreator().getFullName());
            if (debtReminder.getCreator().getAccount() != null) {
                response.setCreatorAccountNumber(debtReminder.getCreator().getAccount().getAccountNumber());
            }
        }

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