package com.example.banking.backend.mapper.account;

import com.example.banking.backend.dto.response.account.GetAccountResponse;
import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.example.banking.backend.dto.response.transaction.TransactionInfoDto;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Bank;
import com.example.banking.backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AccountMapper {
    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

    GetAccountResponse accountToGetAccountResponse(Account account);
    GetAccountTransactionsResponse accountToGetAccountTransactionsResponse(Account account);
    @Mapping(target = "fromBankId", expression = "java(getBankId(transaction.getFromBank()))")
    @Mapping(target = "toBankId", expression = "java(getBankId(transaction.getToBank()))")
    TransactionInfoDto transactionToTransactionInfoDto(Transaction transaction);

    default String getBankId(Bank bank) {
        if (bank == null) return null;
        try {
            return bank.getId().toString();
        } catch (Exception e) {
            // Xử lý trường hợp lazy loading exception
            return null;
        }
    }
    @Mapping(source = "totalTransactions", target = "totalTransactions")
    @Mapping(source = "totalPages", target = "totalPages")
    GetAccountTransactionsResponse accountToGetAccountTransactionsResponse(Account account, Integer totalTransactions, Integer totalPages);
}
