package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.*;
import com.example.banking.backend.dto.response.auth.LoginResponse;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.security.jwt.JwtUtils;
import com.example.banking.backend.security.service.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        String accessToken = jwtUtils.generateAccessToken((UserDetailsImpl) authentication.getPrincipal());
        return LoginResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    @Override
    public void refreshToken(RefreshTokenRequest request) {

    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {

    }

    @Override
    public void changePassword(ChangePasswordRequest request) {

    }

    @Override
    public void verifyOtp(VerifyOtpRequest request) {

    }

    @Override
    public void getUserInfo() {

    }

    @Override
    public void createEmployee(CreateEmployeeRequest request) {

    }

    @Override
    public void getEmployees(int limit, int page) {

    }

    @Override
    public void getEmployeeDetails(UUID employeeId) {

    }

    @Override
    public void updateEmployee(UUID employeeId, UpdateEmployeeRequest request) {

    }

    @Override
    public void deleteEmployee(UUID employeeId) {

    }
}
