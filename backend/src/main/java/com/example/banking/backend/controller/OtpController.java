package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.otp.OtpRequest;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/otp")
@AllArgsConstructor
public class OtpController {

    OtpService otpService;

    @Operation(tags = "📧 OTP"
            , summary = "[CUSTOMER] Request an OTP"
            , description = "Customers request an OTP sent to their email")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ApiResponse<Boolean> generateOtp(@RequestBody OtpRequest otpRequest) {
        otpService.generateAndSendOtp(CustomContextHolder.getCurrentUserId(),
                OtpType.fromValue(otpRequest.getOtpType()));
        return ApiResponse.<Boolean>builder()
                .message("Sent OTP successfully!")
                .status(200)
                .data(true)
                .build();
    }
}
