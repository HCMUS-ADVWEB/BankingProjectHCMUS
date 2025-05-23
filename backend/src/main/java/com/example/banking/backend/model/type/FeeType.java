package com.example.banking.backend.model.type;

public enum FeeType {
    FIXED("SENDER"),
    PERCENTAGE("RECEIVER");

    private final String value;

    FeeType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static FeeType fromValue(String value) {
        for (FeeType type : FeeType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
