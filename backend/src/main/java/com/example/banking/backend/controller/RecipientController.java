package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.RequestToGetReciInfoFromOtherBank;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.DeleteRecipientRequest;
import com.example.banking.backend.dto.request.recipient.RecipientNameRequest;
import com.example.banking.backend.dto.response.account.ExternalAccountDto;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import com.example.banking.backend.dto.response.transaction.RecipientDtoResponse;
import com.example.banking.backend.model.Recipient;
import com.example.banking.backend.service.RecipientService;
import com.example.banking.backend.service.RecipientServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recipients")
@AllArgsConstructor
public class RecipientController {
    RecipientService recipientService;

    @PostMapping()
    public ResponseEntity<ApiResponse<RecipientDtoRes>> addRecipient(
            @Valid @RequestBody AddRecipientRequest request) {
        RecipientDtoRes recipient = recipientService.addRecipient(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<RecipientDtoRes>builder()
                        .status(HttpStatus.CREATED.value())
                        .message("Recipient added successfully")
                        .data(recipient)
                        .build());
    }

    @PutMapping("/{recipientId}")
    public ResponseEntity<ApiResponse<RecipientDtoRes>> updateRecipient(
            @PathVariable String recipientId,
            @Valid @RequestBody AddRecipientRequest request) {

        RecipientDtoRes recipient = recipientService.updateRecipient(UUID.fromString(recipientId), request);

        return ResponseEntity.ok(ApiResponse.<RecipientDtoRes>builder()
                .status(HttpStatus.OK.value())
                .message("Recipient updated successfully")
                .data(recipient)
                .build());

    }


    @DeleteMapping("")
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

    @GetMapping
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


    @PostMapping ("external/recipient-info")
    @GetMapping
    public ResponseEntity<ApiResponse<ExternalAccountDto>> returnRecipientForOtherBank(RequestToGetReciInfoFromOtherBank request) {

        ExternalAccountDto recipients = recipientService.returnRecipientForOtherBank(request);

        return ResponseEntity.ok(ApiResponse.<ExternalAccountDto>builder()
                .status(HttpStatus.OK.value())
                .message("Recipient information retrieved successfully")
                .data(recipients)
                .build());
    }


}
