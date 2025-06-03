package com.example.banking.backend.service;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.CreateDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.mapper.debtReminder.DebtReminderMapper;
import com.example.banking.backend.model.DebtReminder;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.DebtStatusType;
import com.example.banking.backend.repository.DebtReminderRepository;
import com.example.banking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DebtServiceImpl implements DebtService {

    private final DebtReminderRepository debtReminderRepository;
    private final UserRepository userRepository;
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

    @Override
    public ApiResponse<CreateDebtReminderResponse> createDebtReminder(UUID creatorId, CreateDebtReminderRequest request) {
        // Fetch the creator and debtor from the database
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("Creator not found"));
        User debtor = userRepository.findById(request.getDebtorId())
                .orElseThrow(() -> new IllegalArgumentException("Debtor not found"));

        // Create a new DebtReminder entity
        DebtReminder debtReminder = new DebtReminder();
        debtReminder.setId(UUID.randomUUID());
        debtReminder.setCreator(creator); // Set the User object for creator
        debtReminder.setDebtor(debtor);   // Set the User object for debtor
        debtReminder.setAmount(request.getAmount());
        debtReminder.setMessage(request.getMessage());
        debtReminder.setStatus(DebtStatusType.PENDING);
        debtReminder.setCreatedAt(Instant.now());
        debtReminder.setUpdatedAt(Instant.now());

        // Save the entity to the database
        debtReminder = debtReminderRepository.save(debtReminder);

        // Build the response DTO
        CreateDebtReminderResponse response = new CreateDebtReminderResponse();
        response.setId(debtReminder.getId());
        response.setCreatorId(debtReminder.getCreator().getId());
        response.setDebtorId(debtReminder.getDebtor().getId());
        response.setAmount(debtReminder.getAmount());
        response.setMessage(debtReminder.getMessage());
        response.setStatus(debtReminder.getStatus().name());

        // Return the response wrapped in ApiResponse
        return ApiResponse.<CreateDebtReminderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Debt reminder created successfully!")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<Void> payDebtReminder(UUID reminderId, PayDebtRequest request) {
        DebtReminder debtReminder = debtReminderRepository.findById(reminderId)
                .orElseThrow(() -> new IllegalArgumentException("Debt reminder not found"));

        // Update the debt reminder status to PAID
        debtReminder.setStatus(DebtStatusType.PAID);
        debtReminder.setMessage(request.getMessage());
        debtReminder.setTransactionId(request.getTransactionId());
        debtReminder.setUpdatedAt(Instant.now());

        debtReminderRepository.save(debtReminder);

        return ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Debt reminder marked as PAID successfully!")
                .build();
    }

    @Override
    public ApiResponse<Void> cancelDebtReminder(UUID reminderId, CancelDebtReminderRequest request) {
        DebtReminder debtReminder = debtReminderRepository.findById(reminderId)
                .orElseThrow(() -> new IllegalArgumentException("Debt reminder not found"));

        // Update the debt reminder status to CANCELLED
        debtReminder.setStatus(DebtStatusType.CANCELLED);
        debtReminder.setCancelledReason(request.getCancelledReason());
        debtReminder.setUpdatedAt(Instant.now());

        debtReminderRepository.save(debtReminder);

        return ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Debt reminder marked as CANCELLED successfully!")
                .build();
    }
}