package com.example.banking.backend.service;

import com.example.banking.backend.dto.response.bank.BankDto;
import com.example.banking.backend.repository.BankRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BankServiceImpl implements BankService {
    BankRepository bankRepository;
    @Override
    public List<BankDto> getBankInfo() {
        return bankRepository.findAll().stream()
                .map(bank -> new BankDto(bank.getBankCode(), bank.getBankName()))
                .toList();
    }
}
