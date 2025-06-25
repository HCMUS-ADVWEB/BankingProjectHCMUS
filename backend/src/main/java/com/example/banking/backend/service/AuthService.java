package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.ForgotPasswordRequest;
import com.example.banking.backend.dto.request.auth.LoginRequest;
import com.example.banking.backend.dto.request.auth.RefreshTokenRequest;
import com.example.banking.backend.dto.request.auth.ResetPasswordRequest;
import com.example.banking.backend.dto.response.auth.LoginResponse;
import com.example.banking.backend.dto.response.auth.LogoutResponse;
import com.example.banking.backend.dto.response.auth.RefreshTokenResponse;

import java.util.UUID;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    LogoutResponse logout(UUID refreshToken);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
