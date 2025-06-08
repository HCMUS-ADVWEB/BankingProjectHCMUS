package com.example.banking.backend.model.type;

import lombok.Getter;

@Getter
public enum FeeType {
    FIXED("SENDER"),
    PERCENTAGE("RECEIVER");

    private final String value;

    FeeType(String value) {
        this.value = value;
    }

    public static FeeType fromValue(String value) {
        for (FeeType type : FeeType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Fee Type is not valid " + value);
    }
}
