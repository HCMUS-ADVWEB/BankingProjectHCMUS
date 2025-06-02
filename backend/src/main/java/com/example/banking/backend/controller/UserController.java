package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.CreateUserRequest;
import com.example.banking.backend.dto.request.user.UpdateUserRequest;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.model.type.UserRoleType;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getPersonalInfo() {
        UUID userId = CustomContextHolder.getCurrentUserId();
        UserDto userDto = userService.getUserDetails(userId);
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .message("Get personal info successfully!")
                .data(userDto)
                .status(200)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers(@RequestParam(required = false) String role) {
        UserRoleType roleType = null;
        if (role != null) {
            roleType = UserRoleType.fromValue(role);
        }
        List<UserDto> userDtos = userService.getUserList(roleType);
        ApiResponse<List<UserDto>> apiResponse = ApiResponse.<List<UserDto>>builder()
                .message("Get user list successfully!")
                .data(userDtos)
                .status(200)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> getUserDetails(@PathVariable UUID userId) {
        UserDto userDto = userService.getUserDetails(userId);
        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .message("Get user details successfully!")
                .data(userDto)
                .status(200)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createUser(@RequestBody CreateUserRequest request) {
        UserDto userDto = userService.createUser(request);
        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .message("Create user successfully!")
                .data(userDto)
                .status(201)
                .build();
        return ResponseEntity.status(201).body(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable UUID userId, @RequestBody UpdateUserRequest request) {
        UserDto userDto = userService.updateUser(userId, request);
        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .message("Update user successfully!")
                .data(userDto)
                .status(200)
                .build();
        return ResponseEntity.status(200).body(apiResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable UUID userId) {
        userService.deleteUser(userId);
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .message("Delete user successfully!")
                .status(200)
                .build();
        return ResponseEntity.status(200).body(apiResponse);
    }
}
