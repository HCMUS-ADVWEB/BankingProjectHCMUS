package com.example.banking.backend.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Schema(description = "Request to fetch transactions for an account")
public class GetAccountTransactionsRequest {
    @Schema(description = "Account number", example = "5873160242223846", requiredMode = Schema.RequiredMode.REQUIRED)
    private String accountNumber;
}
