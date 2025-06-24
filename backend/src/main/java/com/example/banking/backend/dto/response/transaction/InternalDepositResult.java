package com.example.banking.backend.dto.response.transaction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(name = "Deposit", description = "Return result of deposit action")
public class InternalDepositResult {
   @Schema(description = "Whether the deposit is successful",
           example = "true",
           requiredMode = Schema.RequiredMode.REQUIRED)
   @NotNull(message = "Deposit's success status can not be null")
   Boolean success;

}
