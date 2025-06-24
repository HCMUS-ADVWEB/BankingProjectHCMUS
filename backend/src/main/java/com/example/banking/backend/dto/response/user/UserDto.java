package com.example.banking.backend.dto.response.user;

import com.example.banking.backend.model.type.UserRoleType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Data
@Schema(name = "Profile", description = "Return current user's information")
public class UserDto {
    @Schema(description = "User's id",
            example = "55ef5fb2-fa0f-4230-8639-809021096f28")
    private UUID id;

    @Schema(description = "Username",
            example = "admin1")
    private String username;

    @Schema(description = "User's email",
            example = "admin1@gmail.com")
    private String email;

    @Schema(description = "User's phone number",
            example = "0912345678")
    private String phone;

    @Schema(description = "User's full name",
            example = "Admin 1")
    private String fullName;

    @Schema(description = "User's address",
            example = "1 Đường số 1")
    private String address;

    @Schema(description = "User's date of birth",
            example = "2003-01-01")
    private LocalDate dob;

    @Schema(description = "User's role",
            example = "ADMIN")
    private UserRoleType role;

    @Schema(description = "Whether user is active",
            example = "true")
    private Boolean isActive;

    @Schema(description = "User create timestamp")
    private Instant createdAt;

    @Schema(description = "User update timestamp")
    private Instant updatedAt;
}