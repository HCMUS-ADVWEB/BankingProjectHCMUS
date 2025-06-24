package com.example.banking.backend.service;

import java.util.List;
import java.util.UUID;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.CreateDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.DebtReminderListsResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.PayDebtResponse;
import com.example.banking.backend.model.type.DebtStatusType;

public interface DebtService {
    /**
     * @deprecated Use {@link #getDebtReminderLists(DebtStatusType, int, int)} instead.
     */
    @Deprecated
    ApiResponse<List<GetDebtReminderResponse>> getDebtReminders(DebtStatusType status, int limit, int page);
    
    /**
     * Gets debt reminders separated into created and received lists.
     */
    ApiResponse<DebtReminderListsResponse> getDebtReminderLists(DebtStatusType status, int limit, int page);

    ApiResponse<CreateDebtReminderResponse> createDebtReminder(CreateDebtReminderRequest request);

    ApiResponse<PayDebtResponse> payDebtReminder(UUID reminderId, PayDebtRequest request);

    ApiResponse<Void> cancelDebtReminder(UUID reminderId, CancelDebtReminderRequest request);

    void requestOtpForPayDebt();
}
