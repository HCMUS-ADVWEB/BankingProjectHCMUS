package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.*;
import com.example.banking.backend.dto.response.auth.LoginResponse;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/test")
public class TestController {

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminAccess() {
        System.out.println("Id: " + CustomContextHolder.getCurrentUserId());
        return "Admin";
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/user")
    public String userAccess() {
        return "User";
    }

    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    @GetMapping("/all")
    public String allAccess() {
        return "All";
    }
}
