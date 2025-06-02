package com.example.banking.backend.service;
import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.mapper.debtReminder.DebtReminderMapper;
import com.example.banking.backend.model.DebtReminder;
import com.example.banking.backend.model.type.DebtStatusType;
import com.example.banking.backend.repository.DebtReminderRepository;
import com.example.banking.backend.service.DebtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    public ApiResponse<List<GetDebtReminderResponse>> getDebtReminders(DebtStatusType status, int limit, int page) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit); // Pagination starts at page 0
        Page<DebtReminder> debtReminders = debtReminderRepository.findByStatus(status, pageRequest);
        List<GetDebtReminderResponse> responses = debtReminders.getContent().stream()
                .map(debtReminderMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<GetDebtReminderResponse>>builder()
                .data(responses)
                .status(HttpStatus.OK.value())
                .message("Debt reminders found successfully!")
                .build();
    }
}