package com.example.banking.backend.controller;

import java.util.List;
import java.util.UUID;

import com.example.banking.backend.dto.response.bank.BankDto;
import com.example.banking.backend.service.BankSerivce;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.GetDebtPaymentOtpRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.response.debt.CreateDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.model.type.DebtStatusType;
import com.example.banking.backend.service.DebtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/bank")
@AllArgsConstructor
public class BankController {

    BankSerivce bankService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BankDto>>> getBankInfo(
    ) {
        List<BankDto> response = bankService.getBankInfo();
        return ResponseEntity.ok(ApiResponse.<List<BankDto>>builder()
                .status(HttpStatus.OK.value())
                .message("Bank information retrieved successfully")
                .data(response)
                .build());
    }




}
