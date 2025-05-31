package com.example.banking.backend.service;
import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.mapper.debtReminder.DebtReminderMapper;
import com.example.banking.backend.model.DebtReminder;
import com.example.banking.backend.repository.DebtReminderRepository;
import com.example.banking.backend.service.DebtService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DebtServiceImpl implements DebtService {
    private final DebtReminderRepository debtReminderRepository;
    private final DebtReminderMapper debtReminderMapper;

    @Override
    public ApiResponse<List<GetDebtReminderResponse>> getDebtReminders(String type, String status, int limit, int page) {
        List<GetDebtReminderResponse> responses = debtReminderRepository.findAll().stream()
                .map(debtReminderMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<GetDebtReminderResponse>>builder()
                .data(responses)
                .status(HttpStatus.OK.value())
                .message("Debt reminders found successfully!")
                .build();
    }
}