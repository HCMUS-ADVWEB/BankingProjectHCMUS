package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.DeleteRecipientRequest;
import com.example.banking.backend.model.Recipient;
import com.example.banking.backend.service.RecipientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @PathVariable UUID recipientId,
            @Valid @RequestBody AddRecipientRequest request) {

        Recipient recipient = recipientService.updateRecipient(recipientId, request);

        return ResponseEntity.ok(ApiResponse.<Recipient>builder()
                .status(HttpStatus.OK.value())
                .message("Recipient updated successfully")
                .data(recipient)
                .build());

    }


    @DeleteMapping("/recipients")
    public ResponseEntity<ApiResponse<String>> deleteRecipient(@Valid @RequestBody DeleteRecipientRequest request) {
        try {
            recipientService.deleteRecipient(request);

            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipient deleted successfully")
                    .data("Recipient removed")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to delete recipient: " + e.getMessage())
                            .build());
        }
    }


    @GetMapping("/verify-recipient")
    public ResponseEntity<ApiResponse<Boolean>> verifyRecipient(
            @RequestParam String accountNumber,
            @RequestParam UUID bankId) {
        try {
            boolean isValid = recipientService.verifyRecipient(accountNumber, bankId);

            return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                    .status(HttpStatus.OK.value())
                    .message("Recipient verification completed")
                    .data(isValid)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<Boolean>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .data(false)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Boolean>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Recipient verification failed: " + e.getMessage())
                            .data(false)
                            .build());
        }
    }
}
