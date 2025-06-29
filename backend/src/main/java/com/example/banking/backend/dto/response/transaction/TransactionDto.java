package com.example.banking.backend.dto.response.transaction;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@Getter
@Setter
@Schema(name = "Transaction",
        description = "Transaction's information")
public class TransactionDto {
    @Schema(description = "Transaction's id",
            example = "c33af7e7-4bf1-4699-b4d6-0c42408a0247")
    private String id;

    @Schema(description = "Transaction's bankcode , null is this bank ",
            example = "VCB")
    private String fromBankCode;
    @Schema(description = "Transaction's bankcode, null is this bank ",
            example = "FAK")
    private String toBankCode;

    @Schema(description = "Transaction's amount of money",
            example = "100000")
    private Double amount;

    @Schema(description = "Transaction's date")
    private Instant transactionDate;

    @Schema(description = "Transaction's message or note",
            example = "Tra tien")
    private String message;
}