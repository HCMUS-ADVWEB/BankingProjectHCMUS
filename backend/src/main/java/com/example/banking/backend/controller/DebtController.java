package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.service.DebtService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/debts")
public class DebtController {

    private final DebtService debtService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GetDebtReminderResponse>>> getDebtReminders(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page
    ) {
        ApiResponse<List<GetDebtReminderResponse>> apiResponse = debtService.getDebtReminders(type, status, limit, page);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createDebtReminder(@RequestBody CreateDebtReminderRequest request) {
        return null;
    }

    @DeleteMapping("/{reminderId}")
    public ResponseEntity<ApiResponse<Void>> cancelDebtReminder(@PathVariable UUID reminderId, @RequestBody CancelDebtReminderRequest request) {
        return null;
    }

    @PostMapping("/{reminderId}/pay")
    public ResponseEntity<ApiResponse<Void>> payDebtReminder(@PathVariable UUID reminderId, @RequestBody PayDebtRequest request) {
        return null;
    }
}
