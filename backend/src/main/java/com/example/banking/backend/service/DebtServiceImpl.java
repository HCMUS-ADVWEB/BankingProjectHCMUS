package com.example.banking.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.debt.CancelDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.CreateDebtReminderRequest;
import com.example.banking.backend.dto.request.debt.PayDebtRequest;
import com.example.banking.backend.dto.request.transaction.TransferRequest;
import com.example.banking.backend.dto.response.debt.CreateDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.DebtReminderListsResponse;
import com.example.banking.backend.dto.response.debt.GetDebtReminderResponse;
import com.example.banking.backend.dto.response.debt.PayDebtResponse;
import com.example.banking.backend.dto.response.transaction.TransferResult;
import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.exception.InvalidOtpException;
import com.example.banking.backend.mapper.debtReminder.DebtReminderMapper;
import com.example.banking.backend.model.Account;
import com.example.banking.backend.model.DebtReminder;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.DebtStatusType;
import com.example.banking.backend.model.type.FeeType;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.repository.DebtReminderRepository;
import com.example.banking.backend.repository.UserRepository;
import com.example.banking.backend.repository.account.AccountRepository;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.dto.request.notification.AddNotificationRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DebtServiceImpl implements DebtService {    private final DebtReminderRepository debtReminderRepository;
    private final UserRepository userRepository;
    private final DebtReminderMapper debtReminderMapper;
    private final TransactionService transactionService;
    private final OtpService otpService;
    private final NotificationService notificationService;
    private final AccountRepository accountRepository;

    
    @Override
    public ApiResponse<DebtReminderListsResponse> getDebtReminderLists(DebtStatusType status, int limit, int page) {
        User currentUser = getCurrentUser();
        PageRequest pageRequest = PageRequest.of(page - 1, limit);
        
        // Get created debt reminders
        Page<DebtReminder> createdDebts;
        if (status == null) {
            createdDebts = debtReminderRepository.findByCreator_Id(currentUser.getId(), pageRequest);
        } else {
            createdDebts = debtReminderRepository.findByStatusAndCreator_Id(status, currentUser.getId(), pageRequest);
        }
        
        // Get received debt reminders
        Page<DebtReminder> receivedDebts;
        if (status == null) {
            receivedDebts = debtReminderRepository.findByDebtor_Id(currentUser.getId(), pageRequest);
        } else {
            receivedDebts = debtReminderRepository.findByStatusAndDebtor_Id(status, currentUser.getId(), pageRequest);
        }
        
        // Convert to response DTOs
        List<GetDebtReminderResponse> createdDebtsResponses = createdDebts.getContent().stream()
                .map(debtReminderMapper::toResponse)
                .collect(Collectors.toList());
                
        List<GetDebtReminderResponse> receivedDebtsResponses = receivedDebts.getContent().stream()
                .map(debtReminderMapper::toResponse)
                .collect(Collectors.toList());
        
        // Build the combined response
        DebtReminderListsResponse response = DebtReminderListsResponse.builder()
                .createdDebts(createdDebtsResponses)
                .receivedDebts(receivedDebtsResponses)
                .build();
        
        return ApiResponse.<DebtReminderListsResponse>builder()
                .data(response)
                .status(HttpStatus.OK.value())
                .message("Debt reminders retrieved successfully!")
                .build();
    }
    
    @Override
    public ApiResponse<CreateDebtReminderResponse> createDebtReminder(CreateDebtReminderRequest request) {
        // Get the currently authenticated user
        User creator = getCurrentUser();
        
        // Validate that the amount is positive
        if (request.getAmount() <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }

        // Get the creator's account
        Account creatorAccount = accountRepository.findByUserId(creator.getId())
                .orElseThrow(() -> new BadRequestException("Creator account not found"));

        // Fetch the debtor's account from the database
        Account debtorAccount = accountRepository.findByAccountNumber(request.getDebtorAccountNumber())
                .orElseThrow(() -> new BadRequestException("Debtor account not found"));

        // Get the debtor user from the account
        User debtor = debtorAccount.getUser();
        
        // Ensure creator is not trying to create a debt for themselves
        if (creator.getId().equals(debtor.getId())) {
            throw new BadRequestException("Cannot create a debt reminder for yourself");
        }

        // Create a new DebtReminder entity
        DebtReminder debtReminder = new DebtReminder();
        debtReminder.setId(UUID.randomUUID());
        debtReminder.setCreator(creator); // Set the User object for creator
        debtReminder.setDebtor(debtor);   // Set the User object for debtor
        debtReminder.setAmount(request.getAmount());
        debtReminder.setMessage(request.getMessage());
        debtReminder.setStatus(DebtStatusType.PENDING);
        debtReminder.setCreatedAt(Instant.now());
        debtReminder.setUpdatedAt(Instant.now());

        // Save the entity to the database
        debtReminder = debtReminderRepository.save(debtReminder);
        
        // Notify debtor
        notificationService.addNotification(AddNotificationRequest.builder()
            .userId(debtor.getId())
            .title("New Debt Reminder")
            .content(String.format("%s has created a debt reminder for %.2f VND with message: %s",
                creator.getFullName(),
                debtReminder.getAmount(),
                debtReminder.getMessage()))
            .build());

        // Notify creator
        notificationService.addNotification(AddNotificationRequest.builder()
            .userId(creator.getId())
            .title("Debt Reminder Created")
            .content(String.format("You have created a debt reminder for %.2f VND for %s",
                debtReminder.getAmount(),
                debtor.getFullName()))
            .build());

        // Build the response DTO
        CreateDebtReminderResponse response = new CreateDebtReminderResponse();
        response.setId(debtReminder.getId());
        response.setCreatorId(debtReminder.getCreator().getId());
        response.setDebtorId(debtReminder.getDebtor().getId());
        response.setAmount(debtReminder.getAmount());
        response.setMessage(debtReminder.getMessage());
        response.setStatus(debtReminder.getStatus().name());

        // Return the response wrapped in ApiResponse
        return ApiResponse.<CreateDebtReminderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Debt reminder created successfully!")
                .data(response)
                .build();
    }

    private User getCurrentUser() {
        return userRepository.findById(CustomContextHolder.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }    

    @Override
    public void requestOtpForPayDebt() {
        User currentUser = getCurrentUser();
        // Use user's email directly from JWT/User object instead of requiring it in the request
        otpService.generateAndSendOtp(currentUser.getId(), OtpType.DEBT_PAYMENT);
    }    
    @Override
    @Transactional
    public ApiResponse<PayDebtResponse> payDebtReminder(UUID reminderId, PayDebtRequest request) {
        // Validate the reminder ID
        DebtReminder reminder = debtReminderRepository.findById(reminderId)
                .orElseThrow(() -> new IllegalArgumentException("Debt reminder not found"));
        
        // Check if the debt is in PENDING status
        if (reminder.getStatus() != DebtStatusType.PENDING) {
            throw new BadRequestException("Only PENDING debts can be paid");
        }
        
        // Validate OTP
        boolean isValidOtp = otpService.validateOtp(reminder.getDebtor().getId(), OtpType.DEBT_PAYMENT, request.getOtp());
        if (!isValidOtp) {
            throw new InvalidOtpException("Otp is not valid");
        }        // Retrieve creditor's account number (assuming the creator is the creditor)
        String creditorAccountNumber = reminder.getCreator().getAccount().getAccountNumber();

        // Prepare transfer request
        TransferRequest transferRequest = new TransferRequest();
        transferRequest.setAccountNumberReceiver(creditorAccountNumber);
        transferRequest.setAmount(reminder.getAmount());
        transferRequest.setFeeType(FeeType.SENDER); // Example fee type
        transferRequest.setMessage(request.getMessage());
        transferRequest.setOtp(request.getOtp()); // Set the OTP for transaction validation

        // Call TransactionService to process the transfer
        TransferResult transferResult = transactionService.internalTransfer(transferRequest);

        if (!transferResult.isSuccess()) {
            throw new BadRequestException("Failed to process debt payment: " + transferResult.getErrorMessage());
        }

        // Update reminder status
        reminder.setStatus(DebtStatusType.PAID);
        reminder.setMessage(request.getMessage());
        reminder.setTransactionId(UUID.fromString(transferResult.getTransactionId()));
        debtReminderRepository.save(reminder);

        // Notify creator (creditor)
        notificationService.addNotification(AddNotificationRequest.builder()
            .userId(reminder.getCreator().getId())
            .title("Debt Reminder Paid")
            .content(String.format("%s has paid the debt of %.2f VND with message: %s",
                reminder.getDebtor().getFullName(),
                reminder.getAmount(),
                request.getMessage()))
            .build());

        // Notify debtor
        notificationService.addNotification(AddNotificationRequest.builder()
            .userId(reminder.getDebtor().getId())
            .title("Debt Payment Sent")
            .content(String.format("You have paid the debt of %.2f VND to %s",
                reminder.getAmount(),
                reminder.getCreator().getFullName()))
            .build());

        // Create PayDebtResponse
        PayDebtResponse response = new PayDebtResponse(reminderId, transferResult.getTransactionId(), "Debt paid successfully");

        // Wrap in ApiResponse and return
        return ApiResponse.<PayDebtResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Debt reminder paid successfully")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<Void> cancelDebtReminder(UUID reminderId, CancelDebtReminderRequest request) {
        try {
            // Validate and parse UUID
            String trimmedId = reminderId.toString().trim();
            if (!isValidUUID(trimmedId)) {
                throw new IllegalArgumentException("Invalid UUID format: " + trimmedId);
            }
            UUID reminderUUID = UUID.fromString(trimmedId);            // Fetch the debt reminder
            DebtReminder debtReminder = debtReminderRepository.findById(reminderUUID)
                    .orElseThrow(() -> new IllegalArgumentException("Debt reminder not found"));

            // Check if the debt is in PENDING status
            if (debtReminder.getStatus() != DebtStatusType.PENDING) {
                throw new IllegalArgumentException("Only PENDING debts can be cancelled");
            }

            // Check if the current user is the creator of the debt reminder

            // Update the debt reminder status to CANCELLED
            debtReminder.setStatus(DebtStatusType.CANCELLED);
            debtReminder.setCancelledReason(request.getCancelledReason());
            debtReminder.setUpdatedAt(Instant.now());

            debtReminderRepository.save(debtReminder);

            // Notify debtor
            notificationService.addNotification(AddNotificationRequest.builder()
                .userId(debtReminder.getDebtor().getId())
                .title("Debt Reminder Cancelled")
                .content(String.format("%s has cancelled the debt reminder of %.2f VND. Reason: %s",
                    debtReminder.getCreator().getFullName(),
                    debtReminder.getAmount(),
                    request.getCancelledReason()))
                .build());

            // Notify creator
            notificationService.addNotification(AddNotificationRequest.builder()
                .userId(debtReminder.getCreator().getId())
                .title("Debt Reminder Cancelled")
                .content(String.format("You have cancelled the debt reminder of %.2f VND for %s",
                    debtReminder.getAmount(),
                    debtReminder.getDebtor().getFullName()))
                .build());

            return ApiResponse.<Void>builder()
                    .status(HttpStatus.OK.value())
                    .message("Debt reminder marked as CANCELLED successfully!")
                    .build();
        } catch (IllegalArgumentException e) {
            return ApiResponse.<Void>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build();
        }
    }

    private boolean isValidUUID(String uuid) {
        return uuid.matches("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    }
}