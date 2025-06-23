package com.example.banking.backend.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountInfoResult {
    private boolean success;
    private String accountNumber;
    private Map<String, Object> accountDetails;
    private String errorMessage;


}