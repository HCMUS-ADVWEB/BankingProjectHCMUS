package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.UpdateRecipientRequest;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import com.example.banking.backend.service.RecipientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/recipients")
@AllArgsConstructor
public class RecipientController {
    RecipientService recipientService;

    @Operation(tags = "📗 Recipient"
            , summary = "[CUSTOMER] Add a recipient"
            , description = "Customers add an internal or external recipient to their address book")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<ApiResponse<RecipientDtoRes>> addRecipient(
            @Valid @RequestBody AddRecipientRequest request) {

        RecipientDtoRes recipient =
                request.getBankCode() == null ?
                        recipientService.addRecipientInternal(request) :
                        recipientService.addRecipientExternal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<RecipientDtoRes>builder()
                        .status(HttpStatus.CREATED.value())
                        .message("Recipient added successfully")
                        .data(recipient)
                        .build());
    }

    @Operation(tags = "📗 Recipient"
            , summary = "[CUSTOMER] Update an existing recipient "
            , description = "Customers update an existing internal or external recipient information")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/{recipientId}")
    public ResponseEntity<ApiResponse<RecipientDtoRes>> updateRecipient(
            @Parameter(description = "Id of the recipient that needs to be updated"
                    , example = "b47af5f1-9412-4bf9-99b4-a1b0f8f71d4f"
                    , required = true)
            @PathVariable String recipientId,
            @Valid @RequestBody UpdateRecipientRequest request) {

        RecipientDtoRes recipient = recipientService.updateRecipient(UUID.fromString(recipientId), request);

        return ResponseEntity.ok(ApiResponse.<RecipientDtoRes>builder()
                .status(HttpStatus.OK.value())
                .message("Recipient updated successfully")
                .data(recipient)
                .build());
    }

    @Operation(tags = "📗 Recipient"
            , summary = "[CUSTOMER] Delete an existing recipient "
            , description = "Customers delete an existing internal or external recipient out of their address book")
    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/{recipientId}")
    public ResponseEntity<ApiResponse<?>> deleteRecipient(
            @Parameter(description = "Id of the recipient that needs to be deleted"
                    , example = "b47af5f1-9412-4bf9-99b4-a1b0f8f71d4f"
                    , required = true)
            @PathVariable String recipientId) {

        recipientService.deleteRecipient(recipientId);

        return ResponseEntity.ok(ApiResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Recipient deleted successfully")
                .build());

    }

    @Operation(tags = "📗 Recipient"
            , summary = "[CUSTOMER] Get all recipients"
            , description = "Customers get all recipients in their address book")
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RecipientDtoRes>>> getRecipients(
            @Parameter(description = "Limit per page") @RequestParam(defaultValue = "10") int limit,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "1") int page) {
        List<RecipientDtoRes> recipients = recipientService.getRecipients(limit, page);
        return ResponseEntity.ok(ApiResponse.<List<RecipientDtoRes>>builder()
                .status(HttpStatus.OK.value())
                .message("Recipients retrieved successfully")
                .data(recipients)
                .build());
    }
}
