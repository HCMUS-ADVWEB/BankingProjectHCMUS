package com.example.banking.backend.dto.response.transaction;

import com.example.banking.backend.model.type.TransactionStatusType;
import com.example.banking.backend.model.type.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
public class TransactionInfoDto {
    private UUID id;
    private TransactionType transactionType;
    private String fromBankId;
    private String fromAccountNumber;
    private String toBankId;
    private String toAccountNumber;
    private Double amount;
    private Double fee;
    private TransactionStatusType status;
    private String message;
    private Instant createdAt;
    private Instant updatedAt;
}
