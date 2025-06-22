package com.example.banking.backend.service;

import com.example.banking.backend.dto.response.bank.BankDto;
import com.example.banking.backend.repository.BankRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankServiceImpl implements  BankSerivce{
    BankRepository bankRepository;
    @Override
    public List<BankDto> getBankInfo() {
        return bankRepository.findAll().stream()
                .map(bank -> new BankDto(bank.getBankCode(), bank.getBankName()))
                .toList();
    }
}
