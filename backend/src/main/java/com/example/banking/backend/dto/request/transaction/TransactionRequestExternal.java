package com.example.banking.backend.dto.request.transaction;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionRequestExternal {
    private String accountNumberReceiver;
    private String destinationBankId;
    private Double amount;
    private String feeType;
    private String message;
    private String signature;
    private String hmac;

}
