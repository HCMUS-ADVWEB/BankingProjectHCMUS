package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.otp.OtpRequest;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.service.OtpService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController("api/opt")
@AllArgsConstructor
public class OtpController {

    OtpService otpService;

    @PostMapping
    public ApiResponse<Boolean> generateOtp(
         @RequestBody OtpRequest otpRequest
    ) {
        otpService.generateAndSendOtp(UUID.fromString(otpRequest.getUserId()),
                OtpType.fromValue(otpRequest.getOtpType()));

        return ApiResponse.<Boolean>builder()
                .message("Sent OTP successfully!")
                .status(200)
                .data(true)
                .build();
    }




}
