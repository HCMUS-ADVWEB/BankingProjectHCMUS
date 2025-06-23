package com.example.banking.backend.controller;

import com.example.banking.backend.security.jwt.CustomContextHolder;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
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
