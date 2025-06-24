package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.account.RequestToGetReciInfoFromOtherBank;
import com.example.banking.backend.dto.request.recipient.AddRecipientRequest;
import com.example.banking.backend.dto.request.recipient.DeleteRecipientRequest;
import com.example.banking.backend.dto.request.recipient.RecipientNameRequest;
import com.example.banking.backend.dto.request.recipient.UpdateRecipientRequest;
import com.example.banking.backend.dto.response.account.ExternalAccountDto;
import com.example.banking.backend.dto.response.recipients.RecipientDtoRes;
import com.example.banking.backend.dto.response.transaction.RecipientDtoResponse;
import com.example.banking.backend.model.Recipient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface RecipientService {
    List<RecipientDtoRes> getRecipients(int limit, int page);
    public RecipientDtoRes updateRecipient(UUID recipientId, UpdateRecipientRequest request);
    public void deleteRecipient(String id) ;
    public RecipientDtoRes addRecipientExternal(AddRecipientRequest request);
    public RecipientDtoRes addRecipientInternal(AddRecipientRequest request);

}
