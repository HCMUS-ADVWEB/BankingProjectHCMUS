package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.*;

import java.util.UUID;

public interface AuthService {

    void login(LoginRequest request);

    void refreshToken(RefreshTokenRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void changePassword(ChangePasswordRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void getUserInfo();

    void createEmployee(CreateEmployeeRequest request);

    void getEmployees(int limit, int page);

    void getEmployeeDetails(UUID employeeId);

    void updateEmployee(UUID employeeId, UpdateEmployeeRequest request);

    void deleteEmployee(UUID employeeId);
}
