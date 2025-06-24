package com.example.banking.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "Information to reset password")
public class ResetPasswordRequest implements Serializable {

    @NotNull(message = "Email is required")
    @Email(message = "Email is not valid")
    @Schema(description = "Account's email that the OTP was sent to",
            example = "mail@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @NotNull(message = "Password is required")
    @Schema(description = "New password",
            example = "new_password",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    @NotNull(message = "Confirm password is required")
    @Schema(description = "Re-enter new password",
            example = "new_password",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String confirmPassword;

    @NotNull(message = "Otp is required")
    @Size(message = "Otp length must be 6", min = 6, max = 6)
    @Schema(description = "OTP that was sent to email",
            example = "123456",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String otp;
}
