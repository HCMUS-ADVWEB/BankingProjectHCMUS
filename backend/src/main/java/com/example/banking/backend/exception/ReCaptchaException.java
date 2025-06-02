package com.example.banking.backend.exception;

public class ReCaptchaException extends RuntimeException {
    public ReCaptchaException(String message) {
        super(message);
    }
}
