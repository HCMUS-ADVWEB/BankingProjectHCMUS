package com.example.banking.backend.dto.response.user;

import com.example.banking.backend.model.type.UserRoleType;
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
public class UserDto {
    private UUID id;
    private String username;
    private String email;
    private String phone;
    private String fullName;
    private String address;
    private LocalDate dob;
    private UserRoleType role;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}