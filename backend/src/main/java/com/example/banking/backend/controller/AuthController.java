package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.*;
import com.example.banking.backend.dto.response.auth.LoginResponse;
import com.example.banking.backend.dto.response.auth.LogoutResponse;
import com.example.banking.backend.dto.response.auth.RefreshTokenResponse;
import com.example.banking.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .message("Login successfully!")
                .status(HttpStatus.OK.value())
                .data(response)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = authService.refresh(request);
        ApiResponse<RefreshTokenResponse> apiResponse = ApiResponse.<RefreshTokenResponse>builder()
                .message("Refresh successfully!")
                .status(HttpStatus.OK.value())
                .data(response)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<LogoutResponse>> refreshToken(@RequestParam String refreshToken) {
        LogoutResponse response = authService.logout(UUID.fromString(refreshToken));
        ApiResponse<LogoutResponse> apiResponse = ApiResponse.<LogoutResponse>builder()
                .message("Log out successfully!")
                .status(HttpStatus.OK.value())
                .data(response)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/reset-password/request")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Email sent successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }

    @PostMapping("/reset-password/confirm")
    public ResponseEntity<ApiResponse<?>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Reset password successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }
}
