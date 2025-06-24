package com.example.banking.backend.dto.request.debt;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Schema(description = "Request to pay a debt")
public class PayDebtRequest {

    @NotBlank(message = "OTP cannot be blank")
    @Size(message = "Otp length must be 6", min = 6, max = 6)
    @Schema(description = "An OTP that was sent to customer's email",
            example = "123456",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String otp;

    @Schema(description = "Paying message or note",
            example = "Thanks for lending me money",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Message cannot be blank")
    private String message;
}