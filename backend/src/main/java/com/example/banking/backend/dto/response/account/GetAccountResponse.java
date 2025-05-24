package com.example.banking.backend.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetAccountResponse {
    private String accountNumber;
    private Double balance;
}
