package com.example.banking.backend.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChangePasswordRequest {
    private String oldPassword;
    @NotBlank
    @NotNull
    private String newPassword;
    @NotNull(message = "Otp is required")
    @Size(message = "Otp length must be 6", min = 6, max = 6)
    private String otp;
}
