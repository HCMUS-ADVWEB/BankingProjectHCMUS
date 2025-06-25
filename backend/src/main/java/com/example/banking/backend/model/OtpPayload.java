package com.example.banking.backend.model;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OtpPayload implements Serializable {
    private String otp;
    private String email;
    private String createdAt;
    private String expiresAt;
}
