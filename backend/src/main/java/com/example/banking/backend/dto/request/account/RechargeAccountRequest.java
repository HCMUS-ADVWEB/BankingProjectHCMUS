package com.example.banking.backend.dto.request.account;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RechargeAccountRequest {
    private String username;
    private String accountNumber;
    private Long rechargeAmount;
}
