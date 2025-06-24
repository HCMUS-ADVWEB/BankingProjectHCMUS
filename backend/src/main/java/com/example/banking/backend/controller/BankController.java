package com.example.banking.backend.controller;

import java.util.List;

import com.example.banking.backend.dto.response.bank.BankDto;
import com.example.banking.backend.service.BankService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.banking.backend.dto.ApiResponse;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/bank")
@AllArgsConstructor
public class BankController {

    private final BankService bankService;

    @Operation(tags = "Bank"
            , summary = "[CUSTOMER] Get bank list"
            , description = "Customers get bank list")
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
