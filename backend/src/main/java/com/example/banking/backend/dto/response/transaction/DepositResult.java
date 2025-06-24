package com.example.banking.backend.dto.response.transaction;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(name = "TransactionResult",
        description = "Transaction result")
public class DepositResult {

    @Schema(description = "Transaction result message",
            example = "Transfer successfully!")
    private String message;




}
