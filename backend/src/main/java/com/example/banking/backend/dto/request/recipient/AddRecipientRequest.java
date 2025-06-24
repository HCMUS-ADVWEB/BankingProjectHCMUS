package com.example.banking.backend.dto.request.recipient;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Schema(description = "Request to add this recipient to the address book")
public class AddRecipientRequest {
    @Schema(description = "Recipient's account number",
            example = "5873160242223846",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Recipient's account number can not be null")
    @NotEmpty(message = "Recipient's account number can not be empty")
    private String accountNumber;

    @Schema(description = "Recipient's bank code, if null then the recipient is internal",
            example = "FAK",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String bankCode;

    @Schema(description = "Recipient's nickname",
            example = "Bạn",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String nickName;
}
