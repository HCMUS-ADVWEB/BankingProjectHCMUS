package com.example.banking.backend.model.type;

import lombok.Getter;

@Getter
public enum UserRoleType {
    CUSTOMER("CUSTOMER"),
    ADMIN("ADMIN"),
    MODERATOR("EMPLOYEE");

    private final String value;

    UserRoleType(String value) {
        this.value = value;
    }

    public static UserRoleType fromValue(String value) {
        for (UserRoleType type : UserRoleType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
