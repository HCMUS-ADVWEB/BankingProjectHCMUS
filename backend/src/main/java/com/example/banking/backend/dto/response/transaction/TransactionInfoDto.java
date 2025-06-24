package com.example.banking.backend.dto.response.transaction;

import com.example.banking.backend.model.type.TransactionStatusType;
import com.example.banking.backend.model.type.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(description = "transaction list")
public class TransactionInfoDto {
    @Schema(description = "Transaction's id",
            example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID id;

    @Schema(description = "Transaction type",
            example = "INTERNAL_TRANSFER")
    private TransactionType transactionType;

    @Schema(description = "Sender's bank id",
            example = "null")
    private String fromBankId;

    @Schema(description = "Sender's account number",
            example = "5873244531884664")
    private String fromAccountNumber;

    @Schema(description = "Receiver's bank id",
            example = "null")
    private String toBankId;

    @Schema(description = "Receiver's account number",
            example = "5873244531884664")
    private String toAccountNumber;

    @Schema(description = "Transaction's money amount",
            example = "10000",
            type = "double")
    private Double amount;

    @Schema(description = "Transaction's fee",
            example = "0",
            type = "double")
    private Double fee;

    @Schema(description = "Transaction's progress status",
            example = "PENDING")
    private TransactionStatusType status;

    @Schema(description = "Sender's message",
            example = "null")
    private String message;

    @Schema(description = "Transaction create timestamp")
    private Instant createdAt;

    @Schema(description = "Transaction update timestamp")
    private Instant updatedAt;
}
