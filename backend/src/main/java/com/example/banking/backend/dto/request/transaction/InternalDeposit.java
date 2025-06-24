package com.example.banking.backend.dto.request.transaction;

import com.example.banking.backend.model.type.FeeType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(description = "Request to make a deposit with this information")
public class InternalDeposit {
    @Schema(description = "Receiver's account number",
            example = "5873176036289475")
    String accountNumberReceiver;

    @Schema(description = "Deposit this amount of money",
            example = "1000000")
    Double amount;

}
