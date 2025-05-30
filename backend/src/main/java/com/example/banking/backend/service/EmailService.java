package com.example.banking.backend.service;

import com.example.banking.backend.model.type.OtpType;

public interface EmailService {
    void sendOtpEmail(String to, String otp, OtpType purpose);
}
