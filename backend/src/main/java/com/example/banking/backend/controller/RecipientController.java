package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.account.RequestToGetReciInfoFromOtherBank;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.DeleteRecipientRequest;
import com.example.banking.backend.dto.request.recipient.RecipientNameRequest;
import com.example.banking.backend.dto.request.recipient.UpdateRecipientRequest;
import com.example.banking.backend.dto.response.account.ExternalAccountDto;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import com.example.banking.backend.dto.response.transaction.RecipientDtoResponse;
import com.example.banking.backend.model.Recipient;
import com.example.banking.backend.service.RecipientService;
import com.example.banking.backend.service.RecipientServiceImpl;
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

    @PostMapping()
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

    @PutMapping("/{recipientId}")
    public ResponseEntity<ApiResponse<RecipientDtoRes>> updateRecipient(
            @PathVariable String recipientId,
            @Valid @RequestBody UpdateRecipientRequest request) {

        RecipientDtoRes recipient = recipientService.updateRecipient(UUID.fromString(recipientId), request);

        return ResponseEntity.ok(ApiResponse.<RecipientDtoRes>builder()
                .status(HttpStatus.OK.value())
                .message("Recipient updated successfully")
                .data(recipient)
                .build());

    }


    @DeleteMapping("/{recipientId}")
    public ResponseEntity<ApiResponse<String>> deleteRecipient(@PathVariable String recipientId)
    {

        recipientService.deleteRecipient(recipientId);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Recipient deleted successfully")
                .data("Recipient removed")
                .build());

    }



    @PreAuthorize("hasRole('CUSTOMER')")
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


}
