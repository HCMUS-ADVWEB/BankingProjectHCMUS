package com.example.banking.backend.mapper.account;

import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.model.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AccountMapper {
    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

    GetAccountResponse accountToGetAccountResponse(Account account);

    @Mapping(source = "totalTransactions", target = "totalTransactions")
    @Mapping(source = "totalPages", target = "totalPages")
    GetAccountTransactionsResponse accountToGetAccountTransactionsResponse(Account account, Integer totalTransactions, Integer totalPages);
}
