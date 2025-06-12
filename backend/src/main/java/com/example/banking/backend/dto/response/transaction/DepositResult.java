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
    private double amount;
    private double newBalance;
    private String message;
    private String errorMessage;

    // Constructor cho trường hợp lỗi
    public DepositResult(boolean success, String errorMessage) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.transactionId = null;
        this.amount = 0.0;
        this.newBalance = 0.0;
        this.message = null;
    }
}
