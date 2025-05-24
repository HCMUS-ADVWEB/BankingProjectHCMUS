package com.example.banking.backend.dto.request.account;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateCustomerRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String address;
    private LocalDate dob;
}
