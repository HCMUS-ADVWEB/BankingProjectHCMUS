package com.example.banking.backend.security.jwt;

import com.example.banking.backend.security.service.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public class CustomContextHolder {
    public static UUID getCurrentUserId() {
        UserDetailsImpl userDetails =
                (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails != null ? userDetails.getId() : null;
    }

    public static String getCurrentUsername() {
        UserDetails userDetails =
                (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails != null ? userDetails.getUsername() : null;
    }

    public static boolean isCurrentUserActive() {
        UserDetailsImpl userDetails =
                (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails != null && userDetails.getIsActive();
    }
}
