package com.example.banking.backend.dto.response.transaction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
@Schema(description = "Return result of the transaction")
public class TransferResult {
    @Schema(description = "Whether the transaction is success",
            example = "true",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Transaction success status can not be empty")
    private Boolean success;

    @Schema(description = "Transaction's id if the transaction is made, if null then transaction is failed",
            example = "c33af7e7-4bf1-4699-b4d6-0c42408a0247",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String transactionId; // ID giao dịch (nếu thành công)

    @Schema(description = "Transferred amount of money if the transaction is made, if null then transaction is failed",
            example = "10000",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private Double amount;

    @Schema(description = "Transaction's fee if any",
            example = "0",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private Double fee;

    @Schema(description = "Transaction's message if the transaction is made or if any",
            example = "Tra tien",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String message;

    @Schema(description = "Transaction's error message if the transaction is failed, if null then transaction is made",
            example = "Not enough balance",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String errorMessage; // Nếu thất bại


}