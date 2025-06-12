package com.example.banking.backend.dto.request.debt;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PayDebtRequest {

    @NotBlank(message = "OTP cannot be blank")
    @Size(message = "Otp length must be 6", min = 6, max = 6)
    private String otp;  
    @NotBlank(message = "Message cannot be blank")
    private String message;
}