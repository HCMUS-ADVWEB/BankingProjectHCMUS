package com.example.banking.backend.dto.response.transaction;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class RecipientDtoResponse {
    private UUID  recipientId;
    private String accountNumber;
    private String bankName;
    private String bankCode;
    private String recipientName;
    private String recipientNickname;

}
