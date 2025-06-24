package com.example.banking.backend.dto.request.account;

import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Schema(description = "Request account's detail with these given information")
public class AccountInfoRequest {
    @Schema(description = "Account number",
            example = "5873906278933357",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "Account number can not be empty")
    private String accountNumber;

    @Schema(description = "Fetched account's bank unique code, if code = null, fetched account is internal",
            nullable = true,
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String bankCode;
}