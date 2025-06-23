package com.example.banking.backend.dto.request.recipient;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecipientNameRequest {
    String bankCode;
    String accountNumber;
}
