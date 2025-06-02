package com.example.banking.backend.dto.request.user;

import com.example.banking.backend.model.type.UserRoleType;
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
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
    private String address;
    private LocalDate dob;
    private UserRoleType role;
    private Boolean isActive;
}