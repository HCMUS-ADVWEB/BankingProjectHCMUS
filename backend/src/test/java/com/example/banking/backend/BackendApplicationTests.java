package com.example.banking.backend;

import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.service.OtpService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

    @Autowired
    private OtpService otpService;

    @Test
    void testSendOtpEmail() {
        otpService.generateAndSendOtp(UUID.randomUUID(), "anhkiet07012003@gmail.com", OtpType.DEBT_PAYMENT);
        otpService.generateAndSendOtp(UUID.randomUUID(), "anhkiet07012003@gmail.com", OtpType.PASSWORD_RESET);
        otpService.generateAndSendOtp(UUID.randomUUID(), "anhkiet07012003@gmail.com", OtpType.TRANSFER);
    }
}
