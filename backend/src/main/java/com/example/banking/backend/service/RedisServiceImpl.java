package com.example.banking.backend.service;

import com.example.banking.backend.model.OtpPayload;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.util.AppConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private String buildOtpKey(UUID userId, OtpType purpose) {
        return "otp:" + userId.toString() + ":" + purpose.getValue();
    }

    @Override
    public void saveOtp(UUID userId, String email, String otp, OtpType purpose) {
        ZoneId zoneHCM = ZoneId.of("Asia/Ho_Chi_Minh");
        LocalDateTime now = LocalDateTime.now(zoneHCM);
        LocalDateTime expiresAt = now.plus(Duration.ofMinutes(AppConstants.OTP_EXPIRATION_MINUTES));

        OtpPayload payload = new OtpPayload();
        payload.setOtp(otp);
        payload.setEmail(email);
        payload.setCreatedAt(now.toString());
        payload.setExpiresAt(expiresAt.toString());

        String key = buildOtpKey(userId, purpose);
        redisTemplate.opsForValue().set(key, payload, Duration.ofMinutes(AppConstants.OTP_EXPIRATION_MINUTES));
    }

    @Override
    public Optional<OtpPayload> getOtp(UUID userId, OtpType purpose) {

        String key = buildOtpKey(userId, purpose);
        Object obj = redisTemplate.opsForValue().get(key);
        if (obj == null) return Optional.empty();

        OtpPayload payload = objectMapper.convertValue(obj, OtpPayload.class);
        return Optional.of(payload);
    }

    @Override
    public void deleteOtp(UUID userId, OtpType purpose) {
        String key = buildOtpKey(userId, purpose);
        redisTemplate.delete(key);
    }
}
