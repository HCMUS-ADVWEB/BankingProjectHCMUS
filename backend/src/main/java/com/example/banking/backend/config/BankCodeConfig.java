package com.example.banking.backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class BankCodeConfig {
    @Value("${fintechhub.bank-code}")
    private String bankCode;
}
