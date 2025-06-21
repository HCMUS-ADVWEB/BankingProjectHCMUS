package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.service.OtpService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController("api/opt")
@AllArgsConstructor
public class OptController {

    OtpService optService;

    @PostMapping
    public ApiResponse<Boolean> generateOtp(
            String userId,
            String email,
            String otpType
    ) {
        optService.generateAndSendOtp(UUID.fromString(userId), OtpType.fromValue(otpType));

        return ApiResponse.<Boolean>builder()
                .message("Sent OTP successfully!")
                .status(200)
                .data(true)
                .build();
    }




}
