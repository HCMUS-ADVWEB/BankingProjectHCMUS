package com.example.banking.backend.service;

import com.example.banking.backend.dto.response.bank.BankDto;
import org.springframework.stereotype.Service;

import java.util.List;

public interface BankService {
    List<BankDto> getBankInfo();

}
