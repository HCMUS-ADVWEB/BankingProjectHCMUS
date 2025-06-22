package com.example.banking.backend.dto.request.recipient;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddRecipientRequest {
    private String accountNumber;
    private String bankCode;
    private String nickName;
}
