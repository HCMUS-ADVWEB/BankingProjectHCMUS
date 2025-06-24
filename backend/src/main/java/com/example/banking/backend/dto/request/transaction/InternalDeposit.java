package com.example.banking.backend.dto.request.transaction;

import com.example.banking.backend.model.type.FeeType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InternalDeposit {
    String accountNumberReceiver;
    Double amount;

}
