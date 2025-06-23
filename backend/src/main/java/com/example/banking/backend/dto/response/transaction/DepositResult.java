package com.example.banking.backend.dto.response.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DepositResult {

    private boolean success;
    private String transactionId;
    private double newBalance;
    private String message;




}
