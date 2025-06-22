package com.example.banking.backend.mapper.account;

import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AccountMapper {
    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);
    GetAccountResponse accountToGetAccountResponse(Account account);
    GetAccountTransactionsResponse accountToGetAccountTransactionsResponse(Account account);
}
