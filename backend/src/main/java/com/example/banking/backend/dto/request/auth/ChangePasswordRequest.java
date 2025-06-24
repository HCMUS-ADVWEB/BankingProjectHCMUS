package com.example.banking.backend.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(description = "Request to change password with this information")
public class ChangePasswordRequest {
    @NotBlank(message = "Old password can not be blank")
    @NotNull(message = "Old password can not be null")
    @Schema(description = "Confirm old password",
            example = "oldPassword@123")
    private String oldPassword;

    @NotBlank(message = "New password can not be blank")
    @NotNull(message = "New password can not be null")
    @Schema(description = "New password",
            example = "newPassword@123")
    private String newPassword;
}
