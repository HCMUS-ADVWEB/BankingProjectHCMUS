package com.example.banking.backend.dto.response.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Schema(name = "AccountInformation",
        description = "Fetched account's information")
public class AccountInfoResult {
    @Schema(description = "Account number",
            example = "5873906278933357")
    private String accountNumber;

    @Schema(description = "Account's full name",
            example = "Nguyễn Văn A")
    private String fullName;


}