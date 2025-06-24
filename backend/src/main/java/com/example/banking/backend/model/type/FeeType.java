package com.example.banking.backend.model.type;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum FeeType {
    SENDER("SENDER"),
    RECEIVER("RECEIVER");

    private final String value;

    FeeType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static FeeType fromValue(String value) {
        for (FeeType type : FeeType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Fee Type is not valid: " + value);
    }
}
