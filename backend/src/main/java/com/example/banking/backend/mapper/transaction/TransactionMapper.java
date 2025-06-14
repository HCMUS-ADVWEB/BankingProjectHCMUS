package com.example.banking.backend.mapper.transaction;

import com.example.banking.backend.dto.response.transaction.TransactionInfoDto;
import com.example.banking.backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);

    @Mapping(source = "fromAccount.accountNumber", target = "fromAccountNumber")
    @Mapping(source = "toAccount.accountNumber", target = "toAccountNumber")
    @Mapping(source = "fromBank.id", target = "fromBankId")
    @Mapping(source = "toBank.id", target = "toBankId")
    TransactionInfoDto transactionToTransactionInfoDto(Transaction transaction);
}
