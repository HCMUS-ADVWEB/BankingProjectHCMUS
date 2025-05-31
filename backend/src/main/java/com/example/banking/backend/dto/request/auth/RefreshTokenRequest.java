package com.example.banking.backend.dto.request.auth;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshTokenRequest {

    @NotNull(message = "Refresh token is required")
    private String refreshToken;
}
