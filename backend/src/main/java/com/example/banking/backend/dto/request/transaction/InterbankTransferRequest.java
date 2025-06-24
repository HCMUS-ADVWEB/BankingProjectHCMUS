package com.example.banking.backend.dto.request.transaction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@Schema(description = "Request to transfer money to a FIN's account from other banks")
public class InterbankTransferRequest  {

    @NotBlank(message = "Sender account number is required")
    @Schema(description = "Sender's account number",
            example = "435384934750",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String senderAccountNumber;

    @Schema(description = "Receiver's account number",
            example = "5873160242223846",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Receiver account number is required")
    private String receiverAccountNumber;

    @Schema(description = "Amount of money to transfer",
            example = "50000",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Double amount;

    @Schema(description = "Transaction's message or note",
            example = "note",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String content;
    @Override
    public String toString() {
        return "{\"senderAccountNumber\":\"" + senderAccountNumber +
                "\",\"receiverAccountNumber\":\"" + receiverAccountNumber +
                "\",\"amount\":" + amount +
                ",\"content\":\"" + content + "\"}";
    }

}