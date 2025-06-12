package com.example.banking.backend.dto.request.notification;

import lombok.Data;

@Data
public class SendOtpRequest {
    private String email;   // The recipient's email address
    private String otpType; // The type of OTP (e.g., "TRANSFER", "LOGIN")
}