package com.example.banking.backend.dto.request.transaction;

import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.FeeType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Schema(description = "Request to transfer money with this information")
public class TransferRequest {
    @NotNull(message = "Receiver's account number can not be null")
    @NotEmpty(message = "Receiver's account number can not be empty")
    @Schema(description = "Receiver's account number",
            example = "5873176036289475",
            requiredMode = Schema.RequiredMode.REQUIRED)
    String accountNumberReceiver;

    @NotNull(message = "Transferred amount of money can not be null")
    @Schema(description = "Transferred amount of money",
            example = "10000",
            requiredMode = Schema.RequiredMode.REQUIRED)
    Double amount;

    @NotNull(message = "Transaction's message can not be null")
    @NotEmpty(message = "Transaction's message can not be empty")
    @Schema(description = "Transaction's message or note",
            example = "Tra tien",
            requiredMode = Schema.RequiredMode.REQUIRED)
    String message;

    @NotNull(message = "Transaction's fee type can not be null")
    @Schema(description = "Transaction's fee type shows who will be charged for this transaction",
            example = "SENDER",
            requiredMode = Schema.RequiredMode.REQUIRED)
    FeeType feeType;

    @NotNull(message = "OTP can not be null")
    @NotEmpty(message = "OTP can not be empty")
    @Schema(description = "6-digit OTP to secure the transaction",
            example = "123456",
            minLength = 6,
            maxLength = 6,
            requiredMode = Schema.RequiredMode.REQUIRED)
    String otp;
}
