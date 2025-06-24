package com.example.banking.backend.dto.response.account;

import com.example.banking.backend.dto.response.transaction.TransactionInfoDto;
import com.example.banking.backend.model.Transaction;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(name = "Transactions",
        description = "Return account's transactions as 2 list: sent transactions and received transactions")
public class GetAccountTransactionsResponse {
    @Schema(description = "Sent transactions")
    private Set<TransactionInfoDto> transactionsAsSender;
    @Schema(description = "Received transactions")
    private Set<TransactionInfoDto> transactionsAsReceiver;
}
