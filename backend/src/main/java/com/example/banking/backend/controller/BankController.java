package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.response.bank.BankDto;
import com.example.banking.backend.service.BankService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/banks")
@AllArgsConstructor
public class BankController {

    private final BankService bankService;

    @Operation(tags = "🏦 Bank"
            , summary = "[PROTECTED] Get bank list"
            , description = "Users get bank list")
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
