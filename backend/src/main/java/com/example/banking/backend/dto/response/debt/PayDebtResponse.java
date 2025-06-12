
package com.example.banking.backend.dto.response.debt;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayDebtResponse {
    private UUID reminderId;
    private String transactionId;
    private String message;
}