package com.example.banking.backend.dto.response.bank;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Data
@Schema(name="Bank",
        description = "Bank's information")
public class BankDto {
    @Schema(description = "Bank's Id"
           )
    String id ;
    @Schema(description = "Bank's code",
            example = "FIN")
    String bankCode ;

    @Schema(description = "Bank's name",
            example = "Fintech Hub")
    String bankName ;
}
