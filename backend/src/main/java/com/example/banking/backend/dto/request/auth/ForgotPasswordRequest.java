package com.example.banking.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "Request an OTP to the given email to reset password")
public class ForgotPasswordRequest implements Serializable {

    @NotNull(message = "Email is required")
    @Email(message = "Email is not valid")
    @Schema(description = "Email to get OTP to reset password",
            example = "mail@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
}
