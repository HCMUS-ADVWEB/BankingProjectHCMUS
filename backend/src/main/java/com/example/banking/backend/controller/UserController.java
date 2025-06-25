package com.example.banking.backend.controller;

import com.example.banking.backend.dto.ApiResponse;
import com.example.banking.backend.dto.request.auth.ChangePasswordRequest;
import com.example.banking.backend.dto.request.auth.CreateUserRequest;
import com.example.banking.backend.dto.request.user.UpdateUserRequest;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.model.type.UserRoleType;
import com.example.banking.backend.security.jwt.CustomContextHolder;
import com.example.banking.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Operation(tags = "👤 User"
            , summary = "[PROTECTED] Get current user's information"
            , description = "Users get their own information")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getPersonalInfo() {
        UUID userId = CustomContextHolder.getCurrentUserId();
        UserDto userDto = userService.getUserDetails(userId);
        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .message("Get personal info successfully!")
                .data(userDto)
                .status(200)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @Operation(tags = "👤 User"
            , summary = "[ADMIN] Get users' information"
            , description = "Admin gets users' information")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers(
            @Parameter(description = "User role that needs to be fetched, if null then get all users"
                    , example = "CUSTOMER")
            @RequestParam(required = false) String role) {
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

    @Operation(tags = "👤 User"
            , summary = "[ADMIN] Get a user's information"
            , description = "Admin gets a user's information")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> getUserDetails(
            @Parameter(description = "Id of the user that needs to be fetched"
                    , example = "55ef5fb2-fa0f-4230-8639-809021096f28"
                    , required = true)
            @PathVariable String userId) {
        UserDto userDto = userService.getUserDetails(UUID.fromString(userId));
        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .message("Get user details successfully!")
                .data(userDto)
                .status(200)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @Operation(tags = "👤 User"
            , summary = "[ADMIN] Create a new user"
            , description = "Admin creates a new user")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody @Valid CreateUserRequest request) {
        UserDto userDto = userService.createUser(request);
        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .message("Create user successfully!")
                .data(userDto)
                .status(201)
                .build();
        return ResponseEntity.status(201).body(apiResponse);
    }

    @Operation(tags = "👤 User"
            , summary = "[ADMIN] Update a user's information"
            , description = "Admin updates a user's information")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<?>> updateUser(
            @Parameter(description = "Id of the user that needs to be updated"
                    , example = "55ef5fb2-fa0f-4230-8639-809021096f28"
                    , required = true)
            @PathVariable String userId,
            @RequestBody @Valid UpdateUserRequest request) {
        UserDto userDto = userService.updateUser(UUID.fromString(userId), request);
        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .message("Update user successfully!")
                .data(userDto)
                .status(200)
                .build();
        return ResponseEntity.status(200).body(apiResponse);
    }

    @Operation(tags = "👤 User"
            , summary = "[ADMIN] Delete a user's information"
            , description = "Admin deletes a user's information")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<?>> deleteUser(
            @Parameter(description = "Id of the user that needs to be deleted"
                    , example = "55ef5fb2-fa0f-4230-8639-809021096f28"
                    , required = true)
            @PathVariable String userId) {
        userService.deleteUser(UUID.fromString(userId));
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .message("Delete user successfully!")
                .status(200)
                .build();
        return ResponseEntity.status(200).body(apiResponse);
    }

    @Operation(tags = "👤 User"
            , summary = "[PROTECTED] Change password"
            , description = "Current users change their password")
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Change password successfully!")
                .status(HttpStatus.OK.value())
                .build());
    }
}
