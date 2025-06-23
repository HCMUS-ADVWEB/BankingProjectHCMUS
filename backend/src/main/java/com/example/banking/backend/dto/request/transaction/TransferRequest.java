package com.example.banking.backend.dto.request.transaction;

import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.FeeType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransferRequest {
    String accountNumberReceiver;
    double amount;
    String message;
    FeeType feeType;
    String otp;
}
