package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.account.RequestToGetReciInfoFromOtherBank;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.DeleteRecipientRequest;
import com.example.banking.backend.dto.request.recipient.RecipientNameRequest;
import com.example.banking.backend.dto.response.account.ExternalAccountDto;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import com.example.banking.backend.dto.response.transaction.RecipientDtoResponse;
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

    User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new BadRequestException("NOT FOUND CURRENT USER"));
    }

    @Override
    public RecipientDtoRes updateRecipient(UUID recipientId, AddRecipientRequest request) {
        Recipient recipient = recipientRepository.findById(recipientId)
                .orElseThrow(() -> new InvalidUserException("Recipient not found"));
        User currentUser = getCurrentUser();
        Bank bank = null;
        accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new BadRequestException("NOT FOUND THIS ACCOUNT"));
        if (Objects.equals(request.getAccountNumber(), currentUser.getAccount().getAccountNumber())) {
            throw new BadRequestException("You cannot update your own account as a recipient");
        }
        if (request.getBankCode() != null && !request.getBankCode().trim().isEmpty()) {
            bank = bankRepository.findByBankCode(request.getBankCode()).orElse(null);
        }
        recipient.setUser(currentUser);
        recipient.setRecipientAccountNumber(request.getAccountNumber() == null ? recipient.getRecipientAccountNumber() : request.getAccountNumber());
        recipient.setNickName(request.getNickName() == null ? recipient.getUser().getFullName() : request.getNickName());
        recipient.setBank(bank);
        recipientRepository.save(recipient);
        return new RecipientDtoRes(
                recipient.getId().toString(),
                recipient.getRecipientAccountNumber(),
                recipient.getRecipientName(),
                recipient.getNickName(),
                recipient.getBank() == null ? null : recipient.getBank().getBankName()
        );


    }

    @Override
    public boolean verifyRecipient(String accountNumber, UUID bankId) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Account number cannot be null or empty");
        }
        if (bankId == null) {
            throw new IllegalArgumentException("Bank ID cannot be null");
        }

        Recipient account = recipientRepository.findByAccountNumberAndBankId(accountNumber, bankId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Recipient verification failed: Account not found for accountNumber: " + accountNumber + " and bankId: " + bankId
                ));

        return true;

    }

    @Override
    @Transactional
    public RecipientDtoRes addRecipient(AddRecipientRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new InvalidUserException("NOT FOUND THIS ACCOUNT"));
        recipientRepository.findByAccountNumber(request.getAccountNumber())
                .ifPresent(existingRecipient -> {
                    throw new BadRequestException("Recipient with this account number already exists");
                });

        // Xử lý bank - có thể null
        User currentUser = getCurrentUser();
        Recipient recipient = new Recipient();

        Bank bank = null;
        accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new BadRequestException("NOT FOUND THIS ACCOUNT"));
        if (Objects.equals(request.getAccountNumber(), currentUser.getAccount().getAccountNumber())) {
            throw new BadRequestException("You cannot update your own account as a recipient");
        }
        if (request.getBankCode() != null && !request.getBankCode().trim().isEmpty()) {
            bank = bankRepository.findByBankCode(request.getBankCode()).orElse(null);
        }

        recipient.setUser(currentUser);
        recipient.setRecipientAccountNumber(request.getAccountNumber());
        recipient.setRecipientName(currentUser.getFullName());
        recipient.setNickName(request.getNickName() == null ? account.getUser().getFullName() : request.getNickName());
        recipient.setBank(bank);
        recipientRepository.save(recipient);
        return new RecipientDtoRes(
                recipient.getId().toString(),
                recipient.getRecipientAccountNumber(),
                recipient.getRecipientName(),
                recipient.getNickName(),
                recipient.getBank() == null ? null : recipient.getBank().getBankName()

        );

    }

    @Override
    public void deleteRecipient(DeleteRecipientRequest request) {
        User currentUser = getCurrentUser();
        Recipient recipient = currentUser.getRecipients().stream()
                .filter(r -> r.getRecipientName().equals(request.getRecipientFullName()) &&
                        r.getRecipientAccountNumber().equals(request.getRecipientAccountNumber()) &&
                        r.getBank().getBankName().equals(request.getBankName()))
                .findFirst()
                .orElseThrow(() -> new InvalidUserException("Recipient not found"));


        recipientRepository.delete(recipient);


    }

    @Override
    public List<RecipientDtoResponse> getRecipients(int limit, int page) {
        int pageNumber = page - 1;

        if (limit <= 0 || pageNumber < 0) {
            throw new IllegalArgumentException("Limit must be positive and page must be 1 or greater");
        }

        Pageable pageable = PageRequest.of(pageNumber, limit);

        Page<Recipient> recipientPage = recipientRepository.findAll(pageable);

        return recipientPage.getContent().stream()
                .map(recipient -> new RecipientDtoResponse(
                        recipient.getId(),
                        recipient.getRecipientAccountNumber(),
                        recipient.getBank() == null ? null : recipient.getBank().getBankName(),
                        recipient.getRecipientName(),
                        recipient.getNickName()
                ))
                .collect(Collectors.toList());
    }

    public String getNameFromBankCodeAndAccountNumber(RecipientNameRequest request) {
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
    }

    @Override
    public ExternalAccountDto returnRecipientForOtherBank(RequestToGetReciInfoFromOtherBank request) {
        return null;
    }


}
