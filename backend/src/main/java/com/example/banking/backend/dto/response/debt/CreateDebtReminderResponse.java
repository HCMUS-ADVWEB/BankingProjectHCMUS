package com.example.banking.backend.dto.response.debt;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateDebtReminderResponse {
    private UUID id; // ID of the created debt reminder
    private String message; // Optional message confirming the creation
}