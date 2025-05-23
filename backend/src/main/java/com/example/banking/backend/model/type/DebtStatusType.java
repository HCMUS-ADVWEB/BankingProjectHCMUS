package com.example.banking.backend.model.type;

public enum DebtStatusType {
    PENDING("PENDING"),
    PAID("PAID"),
    CANCELLED("CANCELLED");

    private final String value;

    DebtStatusType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static DebtStatusType fromValue(String value) {
        for (DebtStatusType type : DebtStatusType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
