package com.example.banking.backend.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest implements Serializable {

    @NotNull(message = "Email is required")
    @Email(message = "Email is not valid")
    private String email;
}
