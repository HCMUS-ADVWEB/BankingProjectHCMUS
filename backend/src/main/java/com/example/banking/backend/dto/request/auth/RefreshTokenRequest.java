package com.example.banking.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Schema(description = "Request new access token with this refresh token")
public class RefreshTokenRequest {

    @Schema(description = "Refresh token to get new access token",
            example = "refresh-token",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Refresh token is required")
    private String refreshToken;
}
