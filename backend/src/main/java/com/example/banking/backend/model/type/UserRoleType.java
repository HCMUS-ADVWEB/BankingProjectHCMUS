package com.example.banking.backend.model.type;

public enum UserRoleType {
    USER("CUSTOMER"),
    ADMIN("ADMIN"),
    MODERATOR("EMPLOYEE");

    private final String value;

    UserRoleType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
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
