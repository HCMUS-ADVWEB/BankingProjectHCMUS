package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.model.type.DebtStatusType;

import java.util.List;

public interface DebtService {
    ApiResponse<List<GetDebtReminderResponse>> getDebtReminders(DebtStatusType status, int limit, int page);
}
