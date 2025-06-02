package com.example.banking.backend.model.type;

import lombok.Getter;

@Getter
public enum BankSecurityType {
    RSA("RSA"),
    AES("AES"),
    OTHER("OTHER");

    private final String value;

    BankSecurityType(String value) {
        this.value = value;
    }

    public static BankSecurityType fromValue(String value) {
        for (BankSecurityType type : BankSecurityType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
