package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.ForgotPasswordRequest;
import com.example.banking.backend.dto.request.auth.LoginRequest;
import com.example.banking.backend.dto.request.auth.RefreshTokenRequest;
import com.example.banking.backend.dto.request.auth.ResetPasswordRequest;
import com.example.banking.backend.dto.response.auth.LoginResponse;
import com.example.banking.backend.dto.response.auth.LogoutResponse;
import com.example.banking.backend.dto.response.auth.RefreshTokenResponse;
import com.example.banking.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

    @Operation(tags = "🔒 Authorization"
            , summary = "[PUBLIC] Log in"
            , description = "Unauthorized users log in into the system")
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

    @Operation(tags = "🔒 Authorization"
            , summary = "[PUBLIC] Refresh new token after access token is expired"
            , description = "Expired users request new access token")
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

    @Operation(tags = "🔒 Authorization"
            , summary = "[PROTECTED] Log out"
            , description = "Users log out of the system")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<LogoutResponse>> logout(@Parameter(description = "Account's refresh token") @RequestParam String refreshToken) {
        LogoutResponse response = authService.logout(UUID.fromString(refreshToken));
        ApiResponse<LogoutResponse> apiResponse = ApiResponse.<LogoutResponse>builder()
                .message("Log out successfully!")
                .status(HttpStatus.OK.value())
                .data(response)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @Operation(tags = "🔒 Authorization"
            , summary = "[PUBLIC] Unauthorized users forgot their password"
            , description = "Send OTP to unauthorized users' mail after they request to set new password")
    @PostMapping("/reset-password/request")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Email sent successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }

    @Operation(tags = "🔒 Authorization"
            , summary = "[PUBLIC] Unauthorized users reset their password"
            , description = "Unauthorized users reset their password with given OTP code")
    @PostMapping("/reset-password/confirm")
    public ResponseEntity<ApiResponse<?>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Reset password successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }
}
