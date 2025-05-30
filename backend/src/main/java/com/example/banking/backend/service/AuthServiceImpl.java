package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.*;
import com.example.banking.backend.dto.response.auth.LoginResponse;
import com.example.banking.backend.dto.response.auth.LogoutResponse;
import com.example.banking.backend.dto.response.auth.RefreshTokenResponse;
import com.example.banking.backend.exception.ExistenceException;
import com.example.banking.backend.exception.InvalidTokenException;
import com.example.banking.backend.exception.ReCaptchaException;
import com.example.banking.backend.model.RefreshToken;
import com.example.banking.backend.model.User;
import com.example.banking.backend.repository.RefreshTokenRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.security.jwt.JwtUtils;
import com.example.banking.backend.security.service.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtils jwtUtils;
    private final CaptchaService captchaService;

    @Value("${security.refresh.expiration}")
    private int refreshExpiration;

    @Override
    public LoginResponse login(LoginRequest request) {
        if (!captchaService.verityCaptchaToken(request.getToken())) {
            throw new ReCaptchaException("Fail reCAPTCHA!");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String accessToken = jwtUtils.generateAccessToken((UserDetailsImpl) authentication.getPrincipal());
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));

        RefreshToken oldRefreshToken = user.getRefreshToken();
        if (oldRefreshToken != null) {
            refreshTokenRepository.delete(oldRefreshToken);
            user.setRefreshToken(null);
            userRepository.save(user);
        }

        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setUser(user);
        newRefreshToken.setCreatedAt(Instant.now());
        newRefreshToken.setExpiresAt(Instant.now().plusSeconds(refreshExpiration));
        RefreshToken savedRefreshToken = refreshTokenRepository.save(newRefreshToken);
        user.setRefreshToken(savedRefreshToken);
        userRepository.save(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(savedRefreshToken.getId().toString())
                .build();
    }

    @Override
    public RefreshTokenResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshTokenEntity = refreshTokenRepository
                .findByIdAndExpiresAtAfter(UUID.fromString(request.getRefreshToken()), Instant.now())
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired refresh token"));
        String newAccessToken = jwtUtils.generateAccessToken(refreshTokenEntity.getUser());
        return new RefreshTokenResponse(newAccessToken);
    }

    @Override
    public LogoutResponse logout(UUID refreshToken) {
        RefreshToken refreshTokenEntity = refreshTokenRepository.findById(refreshToken).orElse(null);
        if (refreshTokenEntity != null) {
            refreshTokenRepository.delete(refreshTokenEntity);
        } else {
            throw new ExistenceException("Refresh token not existed!");
        }
        return new LogoutResponse("Logout successfully!");
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
