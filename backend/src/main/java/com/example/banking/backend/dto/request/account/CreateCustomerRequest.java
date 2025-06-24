package com.example.banking.backend.dto.request.account;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Data
@Schema(description = "Request to create a customer account with these information")
public class CreateCustomerRequest {
    @Schema(description = "Account's username",
            example = "customer1",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "Username can not be empty")
    private String username;

    @Schema(description = "Account's password",
            example = "customer1",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "Password can not be empty")
    private String password;

    @Schema(description = "Account's email",
            example = "customer1@gmail.com",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "Email can not be empty")
    @Email(message = "Email is not valid",
            regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;

    @Schema(description = "Account's phone",
            example = "0912345678",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "Phone can not be empty")
    @Pattern(regexp = "^(0[0-9]{9})$",
            message = "Phone number is not valid")
    private String phone;

    @Schema(description = "Customer's full name",
            example = "Nguyễn Văn A",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "Customer's full name can not be empty")
    private String fullName;

    @Schema(description = "Customer's address",
            example = "1 Nguyễn Văn Cừ, TpHCM",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty(message = "Customer's address can not be empty")
    private String address;

    @Schema(description = "Customer's date of birth",
            example = "2003-01-01",
            type = "string",
            format = "yyyy-MM-dd",
            requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate dob;
}
