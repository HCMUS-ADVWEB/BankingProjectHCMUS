package com.example.banking.backend.service;

import com.example.banking.backend.model.OtpPayload;
import com.example.banking.backend.model.type.OtpType;

import java.util.Optional;
import java.util.UUID;

public interface RedisService {
    void saveOtp(UUID userId, String email, String otp, OtpType purpose);
    Optional<OtpPayload> getOtp(UUID userId, OtpType purpose);
    void deleteOtp(UUID userId, OtpType purpose);
}
