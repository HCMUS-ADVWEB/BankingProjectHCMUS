package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.UpdateRecipientRequest;
import com.example.banking.backend.dto.response.account.AccountInfoResult;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.exception.InvalidUserException;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.Bank;
import com.example.banking.backend.model.Recipient;
import com.example.banking.backend.model.User;
import com.example.banking.backend.repository.BankRepository;
import com.example.banking.backend.repository.RecipientRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.repository.account.AccountRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RecipientServiceImpl implements RecipientService {

    RecipientRepository recipientRepository;
    BankRepository bankRepository;
    AccountRepository accountRepository;
    UserRepository userRepository;
    AccountService accountService;

    User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new BadRequestException("NOT FOUND CURRENT USER"));
    }

    @Override
    public RecipientDtoRes updateRecipient(UUID recipientId, UpdateRecipientRequest request) {
        Recipient recipient = recipientRepository.findById(recipientId)
                .orElseThrow(() -> new InvalidUserException("Recipient not found"));
        recipient.setNickName(request.getNickName() == null ? recipient.getUser().getFullName() : request.getNickName());
        recipientRepository.save(recipient);
        return new RecipientDtoRes(
                recipient.getId(),
                recipient.getRecipientAccountNumber(),
                recipient.getRecipientName(),
                recipient.getNickName(),
                recipient.getBank() == null ? null : recipient.getBank().getBankName() ,
                recipient.getBank() == null ? null : recipient.getBank().getBankCode()

                );


    }

    @Override
    @Transactional
    public RecipientDtoRes addRecipientInternal(AddRecipientRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new InvalidUserException("NOT FOUND THIS ACCOUNT"));
        recipientRepository.findByAccountNumber(request.getAccountNumber())
                .ifPresent(existingRecipient -> {
                    throw new BadRequestException("Recipient with this account number already exists");
                });

        User currentUser = getCurrentUser();
        Recipient recipient = new Recipient();
        accountRepository.findByAccountNumber(currentUser.getAccount().getAccountNumber())
                .orElseThrow(() -> new BadRequestException("CANNOT ADD YOUR OWN ACCOUNT AS A RECIPIENT"));

        recipient.setUser(currentUser);
        recipient.setRecipientAccountNumber(request.getAccountNumber());
        recipient.setRecipientName(currentUser.getFullName());
        recipient.setNickName(request.getNickName() == null ? account.getUser().getFullName() : request.getNickName());
        recipient.setBank(null);
        recipientRepository.save(recipient);
        return new RecipientDtoRes(
                recipient.getId(),
                recipient.getRecipientAccountNumber(),
                recipient.getRecipientName(),
                recipient.getNickName(),
                recipient.getBank() == null ? null : recipient.getBank().getBankName() ,
                recipient.getBank() == null ? null : recipient.getBank().getBankCode()
        );
    }

    @Override
    @Transactional
    public RecipientDtoRes addRecipientExternal(AddRecipientRequest request) {

        recipientRepository.findByAccountNumber(request.getAccountNumber())
                .ifPresent((existingRecipient) -> {
                    if (existingRecipient.getBank().getBankCode().equals(request.getBankCode()))
                        throw new BadRequestException("Recipient with this account number already exists");
                });
        User currentUser = getCurrentUser();
        Recipient recipient = new Recipient();

        Bank bank = null;

        if (Objects.equals(request.getAccountNumber(), currentUser.getAccount().getAccountNumber())) {
            throw new BadRequestException("You cannot update your own account as a recipient");
        }
        if (request.getBankCode() != null && !request.getBankCode().trim().isEmpty()) {
            bank = bankRepository.findByBankCode(request.getBankCode()).orElse(null);
        }
        AccountInfoResult accountInfoResult =
                accountService.getAccountInfo(new AccountInfoRequest(
                        request.getAccountNumber(),
                        request.getBankCode()
                ));
        recipient.setUser(currentUser);
        recipient.setRecipientAccountNumber(request.getAccountNumber());
        recipient.setRecipientName(currentUser.getFullName());
        recipient.setNickName(request.getNickName() == null ? accountInfoResult.getFullName() : request.getNickName());
        recipient.setBank(bank);
        recipientRepository.save(recipient);
        return new RecipientDtoRes(
                recipient.getId(),
                recipient.getRecipientAccountNumber(),
                recipient.getRecipientName(),
                recipient.getNickName(),
                recipient.getBank() == null ? null : recipient.getBank().getBankName() ,
                recipient.getBank() == null ? null : recipient.getBank().getBankCode()

        );

    }

    @Override
    public void deleteRecipient(String id) {
        User currentUser = getCurrentUser();
        Recipient recipient = currentUser.getRecipients().stream()
                .filter(r -> r.getId().toString().equals(id))
                .findFirst()
                .orElseThrow(() -> new InvalidUserException("Recipient not found"));
        recipientRepository.delete(recipient);
    }

    Account getAccountCurrentUser() {
        return accountRepository.findByUserId(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Please sign in first "));
    }

    Account getAccountFromNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new BadRequestException("ACCOUNT RECEIVER NOT FOUND"));
    }

    @Override
    public List<RecipientDtoRes> getRecipients(int limit, int page) {
        int pageNumber = page - 1;
        if (limit <= 0 || pageNumber < 0) {
            throw new IllegalArgumentException("Limit must be positive and page must be 1 or greater");
        }

        Pageable pageable = PageRequest.of(pageNumber, limit);
        User currentUser = getCurrentUser();
        Page<Recipient> recipientPage = recipientRepository.findByUserId(currentUser.getId(), pageable);

        return recipientPage.getContent().stream()
                .map(recipient -> new RecipientDtoRes(
                        recipient.getId(),
                        recipient.getRecipientAccountNumber(),
                        recipient.getRecipientName(),
                        recipient.getNickName(),
                        recipient.getBank() == null ? null : recipient.getBank().getBankName() ,
                        recipient.getBank() == null ? null : recipient.getBank().getBankCode()




                ))
                .collect(Collectors.toList());
    }

    /*public String getNameFromBankCodeAndAccountNumber(RecipientNameRequest request) {
        if (request.getBankCode() == null) {
            Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                    .orElseThrow(() -> new BadRequestException("NOT FOUND THIS ACCOUNT"));
            return account.getUser().getFullName();
        } else {
            Bank bank = bankRepository.findByBankCode(request.getBankCode())
                    .orElseThrow(() -> new BadRequestException("NOT FOUND THIS BANK"));
            Account account = accountRepository.findByAccountNumberAndBankId(UUID.fromString(request.getAccountNumber()), bank.getId())
                    .orElseThrow(() -> new BadRequestException("NOT FOUND THIS ACCOUNT"));
            return account.getUser().getFullName();
        }
    }*/
}
