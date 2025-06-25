package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.UpdateRecipientRequest;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface RecipientService {
    List<RecipientDtoRes> getRecipients(int limit, int page);

    RecipientDtoRes updateRecipient(UUID recipientId, UpdateRecipientRequest request);

    void deleteRecipient(String id);

    RecipientDtoRes addRecipientExternal(AddRecipientRequest request);

    RecipientDtoRes addRecipientInternal(AddRecipientRequest request);

}
