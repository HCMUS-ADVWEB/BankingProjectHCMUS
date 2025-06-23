package com.example.banking.backend.dto.request.transaction;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
public class TransferExternalRequest  {
    @NotBlank(message = "Sender account number is required")
    private String senderAccountNumber;
    @NotBlank(message = "Receiver account number is required")
    private String receiverAccountNumber;
    @NotBlank(message = "Receiver bank code is required")
    private Double amount;
    private String content;
    private  String otp ;
    private String bankCode;



}