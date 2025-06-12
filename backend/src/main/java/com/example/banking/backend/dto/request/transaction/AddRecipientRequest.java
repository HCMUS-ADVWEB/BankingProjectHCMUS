package com.example.banking.backend.dto.request.transaction;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddRecipientRequest {
    private String accountNumber;
    private String bankName;
    private  String name ;
}
