package com.example.banking.backend.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Schema(description = "Login result")
public class LoginResponse {
    @Schema(description = "Account's access token", example = "access-token")
    private String accessToken;

    @Schema(description = "Account's refresh token", example = "refresh-token")
    private String refreshToken;
}
