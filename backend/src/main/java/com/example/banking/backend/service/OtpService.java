package com.example.banking.backend.service;

import com.example.banking.backend.model.type.OtpType;

import java.util.UUID;

public interface OtpService {
    void generateAndSendOtp(UUID userId, String email, OtpType otpType);

    void generateAndSendOtp(UUID userId, OtpType otpType);

    boolean validateOtp(UUID userId, OtpType purpose, String inputOtp);

    void deleteOtp(UUID userId, OtpType purpose);
}
