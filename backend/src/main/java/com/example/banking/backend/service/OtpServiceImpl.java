package com.example.banking.backend.service;

import com.example.banking.backend.exception.ExistenceException;
import com.example.banking.backend.model.OtpPayload;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final RedisService redisService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    private String generateRandomOtp() {
        SecureRandom secureRandom = new SecureRandom();
        int otpInt = secureRandom.nextInt(1_000_000);
        return String.format("%06d", otpInt);
    }

    @Override
    public void generateAndSendOtp(UUID userId, String email, OtpType otpType) {
        String otp = generateRandomOtp();
        redisService.saveOtp(userId, email, otp, otpType);
        emailService.sendOtpEmail(email, otp, otpType);
    }

    @Override
    public void generateAndSendOtp(UUID userId, OtpType otpType) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ExistenceException("User not found: " + userId));
        generateAndSendOtp(userId, user.getEmail(), otpType);
    }

    @Override
    public boolean validateOtp(UUID userId, OtpType purpose, String inputOtp) {
        Optional<OtpPayload> otpOpt = redisService.getOtp(userId, purpose);
        if (otpOpt.isEmpty()) return false;

        OtpPayload otpData = otpOpt.get();
        boolean valid = otpData.getOtp().equals(inputOtp);

        if (valid) redisService.deleteOtp(userId, purpose);
        return valid;
    }

    @Override
    public void deleteOtp(UUID userId, OtpType purpose) {
        redisService.deleteOtp(userId, purpose);
    }
}
