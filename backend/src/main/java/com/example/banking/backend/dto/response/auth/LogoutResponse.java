package com.example.banking.backend.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Schema(description = "Notification after logging out")
public class LogoutResponse {
    @Schema(description = "Message after logging out",
            example = "Log out successfully!")
    private String message;
}
