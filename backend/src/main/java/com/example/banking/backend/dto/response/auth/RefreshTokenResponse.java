package com.example.banking.backend.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Schema(description = "Return new access token")
public class RefreshTokenResponse {
    @Schema(description = "New access token",
            example = "new-access-token")
    private String accessToken;
}
