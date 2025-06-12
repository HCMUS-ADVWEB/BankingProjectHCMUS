package com.example.banking.backend.dto.request.transaction;

import com.example.banking.backend.model.type.FeeType;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class TransferRequestExternal {
    String accountNumberReceiver;
    UUID destinationBankId; // Ngân hàng đích
    double amount;
    String message;
    FeeType feeType;
}
