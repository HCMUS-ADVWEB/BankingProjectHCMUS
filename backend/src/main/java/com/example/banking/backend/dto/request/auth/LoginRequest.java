package com.example.banking.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Schema(description = "Request to login with the credential information below")
public class LoginRequest {

    @Schema(description = "Username",
            example = "customer1",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Username is required")
    private String username;


    @Schema(description = "Password",
            example = "password",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Password is required")
    private String password;

    @Schema(description = "reCAPTCHA token",
            example = "secret-token-to-test",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "reCAPTCHA is required")
    private String token;
}
