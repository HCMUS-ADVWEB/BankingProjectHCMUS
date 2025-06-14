package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.DeleteRecipientRequest;
import com.example.banking.backend.dto.response.transaction.RecipientDtoResponse;
import com.example.banking.backend.model.Recipient;
import com.example.banking.backend.service.RecipientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class RecipientController {
    RecipientService recipientService;

    @PostMapping("/recipients")
    public ResponseEntity<ApiResponse<Recipient>> addRecipient(
            @Valid @RequestBody AddRecipientRequest request) {
        Recipient recipient = recipientService.addRecipient(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Recipient>builder()
                        .status(HttpStatus.CREATED.value())
                        .message("Recipient added successfully")
                        .data(recipient)
                        .build());
    }

    @PutMapping("/recipients/{recipientId}")
    public ResponseEntity<ApiResponse<Recipient>> updateRecipient(
            @PathVariable String recipientId,
            @Valid @RequestBody AddRecipientRequest request) {

        Recipient recipient = recipientService.updateRecipient(UUID.fromString(recipientId), request);

        return ResponseEntity.ok(ApiResponse.<Recipient>builder()
                .status(HttpStatus.OK.value())
                .message("Recipient updated successfully")
                .data(recipient)
                .build());

    }


    @DeleteMapping("/recipients")
    public ResponseEntity<ApiResponse<String>> deleteRecipient(@Valid @RequestBody DeleteRecipientRequest request) {

            recipientService.deleteRecipient(request);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipient deleted successfully")
                    .data("Recipient removed")
                    .build());

    }


    @GetMapping("/verify-recipient")
    public ResponseEntity<ApiResponse<Boolean>> verifyRecipient(
            @RequestParam String accountNumber,
            @RequestParam String bankId) {

            boolean isValid = recipientService.verifyRecipient(accountNumber, UUID.fromString(bankId));

            return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipient verification completed")
                    .data(isValid)
                    .build());

    }
    @GetMapping("/recipients")
    public ResponseEntity<ApiResponse<List<RecipientDtoResponse>>> getRecipients(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "1") int page) {

        List<RecipientDtoResponse> recipients = recipientService.getRecipients(limit, page);
        return ResponseEntity.ok(ApiResponse.<List<RecipientDtoResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Recipients retrieved successfully")
                .data(recipients)
                .build());

    }
}
