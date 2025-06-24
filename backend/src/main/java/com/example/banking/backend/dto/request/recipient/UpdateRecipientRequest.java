package com.example.banking.backend.dto.request.recipient;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Schema(description = "Request to update this information of the recipient")
public class UpdateRecipientRequest {
    @Schema(description = "Recipient's new nickname",
            example = "Bạn A",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private String nickName;
}
