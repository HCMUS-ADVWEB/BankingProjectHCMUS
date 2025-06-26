package com.example.banking.backend.dto.response.recipients;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(name = "Recipient",
        description = "Return recipient's detail")
public class RecipientDtoRes {
    @Schema(description = "Recipient's id",
            example = "b47af5f1-9412-4bf9-99b4-a1b0f8f71d4f")
    UUID id;

    @Schema(description = "Recipient's account number",
            example = "9704214212222")
    String recipientAccountNumber;

    @Schema(description = "Recipient's full name",
            example = "Nguyễn Văn A")
    String recipientName;

    @Schema(description = "Recipient's nick name",
            example = "Bạn")
    String nickName;

    @Schema(description = "Recipient's bank name, if null then recipient is internal",
            example = "Fake Bank")
    String bankName;
    @Schema(description = "Recipient's bank Code, if null then recipient is internal",
            example = "FAK ")
    String bankCode ;
}
