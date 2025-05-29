package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.*;
import com.example.banking.backend.dto.response.auth.LoginResponse;
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
                .message("Login successful!")
                .status(HttpStatus.OK.value())
                .data(response)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<?>> refreshToken(@RequestBody RefreshTokenRequest request) {
        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return null;
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
        return null;
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordRequest request) {
        return null;
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        return null;
    }

    @GetMapping("/user-info")
    public ResponseEntity<ApiResponse<?>> getUserInfo() {
        return null;
    }

    @PostMapping("/employees")
    public ResponseEntity<ApiResponse<?>> createEmployee(@RequestBody CreateEmployeeRequest request) {
        return null;
    }

    @GetMapping("/employees")
    public ResponseEntity<ApiResponse<?>> getEmployees(@RequestParam(defaultValue = "10") int limit, @RequestParam(defaultValue = "1") int page) {
        return null;
    }

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<?>> getEmployeeDetails(@PathVariable UUID employeeId) {
        return null;
    }

    @PutMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<?>> updateEmployee(@PathVariable UUID employeeId, @RequestBody UpdateEmployeeRequest request) {
        return null;
    }

    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable UUID employeeId) {
        return null;
    }
}
