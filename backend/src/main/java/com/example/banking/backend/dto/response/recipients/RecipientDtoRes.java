package com.example.banking.backend.dto.response.recipients;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecipientDtoRes {
    String id ;
    String recipientAccountNumber;
    String recipientName;
    String nickName;
    String bankName;
}
