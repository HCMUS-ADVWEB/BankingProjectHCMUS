package com.example.banking.backend.model.type;

public enum TransactionType {
    INTERNAL_TRANSFER("INTERNAL_TRANSFER"),
    INTERBANK_TRANSFER("INTERBANK_TRANSFER"),
    DEBT_PAYMENT("DEBT_PAYMENT"),
    DEPOSIT("DEPOSIT");

    private final String value;

    TransactionType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
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
