package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.DeleteRecipientRequest;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import com.example.banking.backend.dto.response.transaction.RecipientDtoResponse;
import com.example.banking.backend.model.Recipient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface RecipientService {
    List<RecipientDtoResponse> getRecipients(int limit, int page);
    public RecipientDtoRes updateRecipient(UUID recipientId, AddRecipientRequest request);
    public RecipientDtoRes addRecipient(AddRecipientRequest request) ;
    public void deleteRecipient(DeleteRecipientRequest deleteRecipientRequest) ;
    public boolean verifyRecipient(String accountNumber, UUID bankId) ;



}
