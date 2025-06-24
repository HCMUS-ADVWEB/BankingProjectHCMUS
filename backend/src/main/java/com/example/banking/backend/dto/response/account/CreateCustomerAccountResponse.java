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
@Schema(name = "Account", description = "Created account information")
public class CreateCustomerAccountResponse {
    @Schema(description = "Auto-generated account number", example = "5873160242223846")
    private String accountNumber;
}
