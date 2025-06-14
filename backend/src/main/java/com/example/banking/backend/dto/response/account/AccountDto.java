package com.example.banking.backend.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Data
@AllArgsConstructor
@Getter
@Setter
public class AccountDto {
    private UUID id;
    private String accountNumber;
    private String bankName;
    private String fullName;

}