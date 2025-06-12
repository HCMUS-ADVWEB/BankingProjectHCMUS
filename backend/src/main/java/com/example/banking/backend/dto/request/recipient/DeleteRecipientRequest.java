package com.example.banking.backend.dto.request.recipient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestParam;

@Getter
@Setter
public class DeleteRecipientRequest {
    @NotBlank(message = "Recipient full name cannot be blank")
    String recipientFullName;
    @NotBlank(message = "Recipient account number cannot be blank")
    String recipientAccountNumber;
    @NotBlank(message = "Bank name cannot be blank")
    String bankName;
}

