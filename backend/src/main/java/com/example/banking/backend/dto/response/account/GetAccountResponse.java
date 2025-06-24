package com.example.banking.backend.dto.response.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(name = "MyAccount",
        description = "Return current account's account number and balance")
public class GetAccountResponse {
    @Schema(description = "Account number",
            example = "5873160242223846")
    private String accountNumber;
    @Schema(description = "Balance",
            example = "1000000")
    private Double balance;
}
