package com.example.banking.backend.model.type;

import lombok.Getter;

@Getter
public enum TransactionType {
    INTERNAL_TRANSFER("INTERNAL_TRANSFER"),
    INTERBANK_TRANSFER("INTERBANK_TRANSFER"),
    DEBT_PAYMENT("DEBT_PAYMENT"),
    DEPOSIT("DEPOSIT");

    private final String value;

    TransactionType(String value) {
        this.value = value;
    }

    public static TransactionType fromValue(String value) {
        for (TransactionType type : TransactionType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
