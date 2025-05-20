package com.example.banking.backend.dto;

import lombok.Getter;

@Getter
public enum ErrorCode {

    UNAUTH(401, "Unauthenticated") ,
    ;

    private int code ;
    private String message ;


    ErrorCode(int code, String message) {
        this.code = code ;
        this.message = message ;
    }
}
