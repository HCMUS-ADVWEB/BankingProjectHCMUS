package com.example.banking.backend.exception;

public class ExistenceException extends RuntimeException {
    public ExistenceException(String message) {
        super(message);
    }
}
