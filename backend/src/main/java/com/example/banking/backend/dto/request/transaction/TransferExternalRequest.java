package com.example.banking.backend.dto.request.transaction;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
@Schema(description = "Request to make an external transaction with this information")
public class TransferExternalRequest  {
    @NotBlank(message = "Sender account number is required")
    @Schema(description = "Sender's account number",
            example = "5873160242223846",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String senderAccountNumber;

    @NotBlank(message = "Receiver account number is required")
    @Schema(description = "Receiver's account number",
            example = "5873160242223846",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String receiverAccountNumber;

    @NotNull(message = "Transferred amount of money can not be null")
    @Schema(description = "Transferred amount of money",
            example = "100000",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Double amount;

    @NotNull(message = "Transaction's message can not be null")
    @NotEmpty(message = "Transaction's message can not be empty")
    @Schema(description = "Transaction's message or note",
            example = "Tra tien lien ngan hang",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @NotNull(message = "OTP can not be null")
    @NotEmpty(message = "OTP can not be empty")
    @Schema(description = "6-digit OTP to secure the transaction",
            example = "123456",
            minLength = 6,
            maxLength = 6,
            requiredMode = Schema.RequiredMode.REQUIRED)
    private  String otp ;

    @NotNull(message = "Receiver's bank code can not be null")
    @NotEmpty(message = "Receiver's bank code can not be empty")
    @Schema(description = "Receiver's bank code",
            example = "FAK",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String bankCode;
}