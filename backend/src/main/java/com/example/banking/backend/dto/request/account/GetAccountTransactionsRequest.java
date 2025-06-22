package com.example.banking.backend.dto.request.account;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetAccountTransactionsRequest {
    private String accountNumber;
}
