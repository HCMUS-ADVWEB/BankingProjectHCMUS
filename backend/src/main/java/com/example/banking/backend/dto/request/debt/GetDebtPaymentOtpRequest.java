package com.example.banking.backend.dto.request.debt;

import java.io.Serializable;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDebtPaymentOtpRequest implements Serializable {

    @NotNull(message = "Email is required")
    @Email(message = "Email is not valid")
    private String email;
}
