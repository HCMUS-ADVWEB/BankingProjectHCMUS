package com.example.banking.backend.dto.request.otp;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Schema(description = "Request to send an OTP with this information")
public class OtpRequest {
    @Schema(description = "OTP type shows what this OTP is used for",
            example = "TRANSFER",
            requiredMode = Schema.RequiredMode.REQUIRED)
    String otpType;
}
