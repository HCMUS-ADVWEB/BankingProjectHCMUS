package com.example.banking.backend.dto.response.transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter

public class TransferResult {
    private boolean success;
    private String transactionId; // ID giao dịch (nếu thành công)
    private double amount;
    private double fee;
    private String message;
    private String errorMessage; // Nếu thất bại


}