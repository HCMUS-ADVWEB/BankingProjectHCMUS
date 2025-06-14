package com.example.banking.backend.dto.request.recipient;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddRecipientRequest {
    private String accountNumber;
    private String bankName;
    private String name ;
    private String nickName;
}
