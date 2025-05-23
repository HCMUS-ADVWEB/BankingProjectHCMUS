package com.example.banking.backend.model.type;

public enum TransactionStatusType {
    PENDING("PENDING"),
    COMPLETED("COMPLETED"),
    FAILED("FAILED"),
    CANCELLED("CANCELLED");

    private final String value;

    TransactionStatusType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static TransactionStatusType fromValue(String value) {
        for (TransactionStatusType type : TransactionStatusType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
