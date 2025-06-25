package com.example.banking.backend.model.type;

import lombok.Getter;

@Getter
public enum OtpType {
    TRANSFER("TRANSFER", "Chuyển khoản", "💸"),
    PASSWORD_RESET("PASSWORD_RESET", "Reset password", "🔒"),
    DEBT_PAYMENT("DEBT_PAYMENT", "Trả nợ", "💳");

    private final String value;
    private final String displayName;
    private final String icon;

    OtpType(String value, String displayName, String icon) {
        this.value = value;
        this.displayName = displayName;
        this.icon = icon;
    }

    public static OtpType fromValue(String value) {
        for (OtpType type : OtpType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
