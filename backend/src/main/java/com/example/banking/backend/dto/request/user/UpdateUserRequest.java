package com.example.banking.backend.dto.request.user;

import com.example.banking.backend.model.type.UserRoleType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateUserRequest implements Serializable {
    @Schema(description = "User's password",
            example = "employee100@123")
    private String password;

    @Email(message = "Email is not valid")
    @Schema(description = "User's email",
            example = "employee100@example.com")
    private String email;

    @Schema(description = "User's phone number",
            example = "0123456789")
    private String phone;

    @Schema(description = "User's full name",
            example = "Employee 100")
    private String fullName;

    @Schema(description = "User's address",
            example = "1 Đường số 1")
    private String address;

    @PastOrPresent(message = "Dob is not valid")
    @Schema(description = "User's date of birth",
            example = "2003-01-01")
    private LocalDate dob;

    @Schema(description = "User's role",
            example = "EMPLOYEE")
    private UserRoleType role;

    @Schema(description = "Whether user is active",
            example = "true")
    private Boolean isActive;
}