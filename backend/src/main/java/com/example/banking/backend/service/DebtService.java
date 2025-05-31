package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.model.DebtReminder;
import java.util.List;
import java.util.UUID;

public interface DebtService {

    ApiResponse<List<GetDebtReminderResponse>> getDebtReminders(String type, String status, int limit, int page);

    // void createDebtReminder(CreateDebtReminderRequest request);

    // void cancelDebtReminder(UUID reminderId, CancelDebtReminderRequest request);

    // void payDebtReminder(UUID reminderId, PayDebtRequest request);

}
