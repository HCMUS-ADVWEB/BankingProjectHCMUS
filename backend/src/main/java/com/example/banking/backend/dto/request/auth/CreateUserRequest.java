package com.example.banking.backend.dto.request.auth;

import com.example.banking.backend.model.type.UserRoleType;
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
public class CreateUserRequest implements Serializable {
    @NotNull(message = "Username is required")
    private String username;

    @NotNull(message = "Password is required")
    private String password;

    @NotNull(message = "Email is required")
    @Email(message = "Email is not valid")
    private String email;

    @NotNull(message = "Phone is required")
    private String phone;

    @NotNull(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Address is required")
    private String address;

    @NotNull(message = "Dob is required")
    @PastOrPresent(message = "Dob is not valid")
    private LocalDate dob;

    @NotNull(message = "Role is required")
    private UserRoleType role;

    private Boolean isActive;
}