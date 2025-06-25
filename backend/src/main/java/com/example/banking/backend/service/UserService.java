package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.ChangePasswordRequest;
import com.example.banking.backend.dto.request.auth.CreateUserRequest;
import com.example.banking.backend.dto.request.user.UpdateUserRequest;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.UserRoleType;

import java.util.List;
import java.util.UUID;

public interface UserService {

    User getUser(UUID userId);

    UserDto getUserDetails(UUID userId);

    List<UserDto> getUserList(UserRoleType roleType);

    UserDto createUser(CreateUserRequest request);

    UserDto updateUser(UUID userId, UpdateUserRequest request);

    void deleteUser(UUID userId);

    void changePassword(ChangePasswordRequest request);
}
