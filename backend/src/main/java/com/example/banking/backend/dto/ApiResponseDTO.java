package com.example.banking.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ApiResponseDTO {
    private String message;
    private Object data;
    private ErrorCode errorCode ;









}
