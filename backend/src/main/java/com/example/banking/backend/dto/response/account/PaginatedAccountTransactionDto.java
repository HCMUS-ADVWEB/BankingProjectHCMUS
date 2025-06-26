package com.example.banking.backend.dto.response.account;

import com.example.banking.backend.model.Account;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Schema(description = "Paginated result of an account's transactions with metadata")
@Getter
@Setter
public class PaginatedAccountTransactionDto {

    @Schema(description = "The account information including paginated transactions")
    private Account account;

    @Schema(description = "Total number of transactions after applying filters", example = "24")
    private int totalTransactions;

    @Schema(description = "Total number of pages based on the page size", example = "5")
    private int totalPages;
}