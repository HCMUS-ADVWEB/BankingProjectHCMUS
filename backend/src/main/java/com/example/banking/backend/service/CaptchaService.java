package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.*;
import com.example.banking.backend.dto.response.auth.LoginResponse;
import com.example.banking.backend.dto.response.auth.LogoutResponse;
import com.example.banking.backend.dto.response.auth.RefreshTokenResponse;

import java.util.UUID;

public interface CaptchaService {
    boolean verityCaptchaToken(String token);
}
