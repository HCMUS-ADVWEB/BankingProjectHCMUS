package com.example.banking.backend.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ExternalAccountDto {
    String accountNumber;
    String accountName;
    String bankCode;
}
