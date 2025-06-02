package com.example.banking.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.service.DebtService;
import com.example.banking.backend.model.type.DebtStatusType;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GetDebtReminderResponse>>> getDebtReminders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        DebtStatusType debtStatusType = status != null ? DebtStatusType.fromValue(status) : null;
        ApiResponse<List<GetDebtReminderResponse>> response = debtService.getDebtReminders(debtStatusType, limit, page);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    // public ResponseEntity<ApiResponse<CreateDebtReminderResponse>> createDebtReminder(@RequestBody CreateDebtReminderRequest request) {
    //     ApiResponse<List<GetDebtReminderResponse>> apiResponse = debtService.createDebtReminder(request);
    //     return ResponseEntity.ok(new ApiResponse<>(response));
    // }

    @DeleteMapping("/{reminderId}")
    public ResponseEntity<ApiResponse<Void>> cancelDebtReminder(@PathVariable UUID reminderId, @RequestBody CancelDebtReminderRequest request) {
        return null;
    }

    @PostMapping("/{reminderId}/pay")
    public ResponseEntity<ApiResponse<Void>> payDebtReminder(@PathVariable UUID reminderId, @RequestBody PayDebtRequest request) {
        return null;
    }
}
