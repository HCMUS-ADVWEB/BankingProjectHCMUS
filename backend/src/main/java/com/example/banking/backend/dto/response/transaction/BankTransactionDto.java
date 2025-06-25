package com.example.banking.backend.dto.response.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BankTransactionDto {
    List<TransactionDto> listTransaction ;
    int total_page;
    int current_page;
    int per_page;
    int current_per_page;
    int totalTransaction ;
}
