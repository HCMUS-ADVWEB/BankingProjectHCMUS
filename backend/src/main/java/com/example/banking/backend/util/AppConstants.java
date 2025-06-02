package com.example.banking.backend.util;

public class AppConstants {
    public static final int OTP_EXPIRATION_MINUTES = 10;
    public static final int JWT_EXPIRATION_SECONDS = 3600 * 24 * 30;

    private AppConstants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}
