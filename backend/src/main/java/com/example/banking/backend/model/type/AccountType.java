package com.example.banking.backend.model.type;

import lombok.Getter;

@Getter
public enum AccountType {
    PAYMENT("PAYMENT");

    private final String value;

    AccountType(String value) {
        this.value = value;
    }

    public static AccountType fromValue(String value) {
        for (AccountType type : AccountType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
