package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.*;
import com.example.banking.backend.dto.response.auth.LogoutResponse;
import com.example.banking.backend.dto.response.auth.RefreshTokenResponse;
import com.example.banking.backend.dto.response.auth.LoginResponse;

import java.util.UUID;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    LogoutResponse logout(UUID refreshToken);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
