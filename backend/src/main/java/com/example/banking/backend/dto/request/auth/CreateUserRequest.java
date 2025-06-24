package com.example.banking.backend.dto.request.auth;

import com.example.banking.backend.model.type.UserRoleType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "Request to create a user with this information")
public class CreateUserRequest implements Serializable {
    @NotNull(message = "Username is required")
    @Schema(description = "Username",
            example = "employee100")
    private String username;

    @NotNull(message = "Password is required")
    @Schema(description = "User's password",
            example = "employee100@123")
    private String password;

    @NotNull(message = "Email is required")
    @Email(message = "Email is not valid")
    @Schema(description = "User's email",
            example = "employee100@example.com")
    private String email;

    @NotNull(message = "Phone is required")
    @Schema(description = "User's phone number",
            example = "0123456789")
    private String phone;

    @NotNull(message = "Full name is required")
    @Schema(description = "User's full name",
            example = "Employee 100")
    private String fullName;

    @NotNull(message = "Address is required")
    @Schema(description = "User's address",
            example = "1 Đường số 1")
    private String address;

    @NotNull(message = "Dob is required")
    @PastOrPresent(message = "Dob is not valid")
    @Schema(description = "User's date of birth",
            example = "2003-01-01")
    private LocalDate dob;

    @NotNull(message = "Role is required")
    @Schema(description = "User's role",
            example = "EMPLOYEE")
    private UserRoleType role;

    @Schema(description = "Whether user is active",
            example = "true",
            defaultValue = "true")
    private Boolean isActive;
}