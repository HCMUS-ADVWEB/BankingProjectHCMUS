package com.example.banking.backend.service;

import com.example.banking.backend.dto.request.auth.CreateUserRequest;
import com.example.banking.backend.dto.request.user.UpdateUserRequest;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.exception.ExistenceException;
import com.example.banking.backend.mapper.account.UserMapper;
import com.example.banking.backend.model.User;
import com.example.banking.backend.model.type.UserRoleType;
import com.example.banking.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private Instant getCurrentTime() {
        return ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
    }

    @Override
    public User getUser(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ExistenceException("User not existed!"));
    }

    @Override
    public UserDto getUserDetails(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ExistenceException("User not existed!"));
        return UserDto.builder()
                .id(user.getId())
                .dob(user.getDob())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .address(user.getAddress())
                .createdAt(user.getCreatedAt())
                .fullName(user.getFullName())
                .isActive(user.getIsActive())
                .updatedAt(user.getUpdatedAt())
                .username(user.getUsername())
                .build();
    }

    @Override
    public List<UserDto> getUserList(UserRoleType roleType) {
        List<User> users = List.of();
        if (roleType != null) {
            users = userRepository.findAllByRole(roleType);
        } else {
            users = userRepository.findAll();
        }
        List<UserDto> userDtos = List.of();
        if (!users.isEmpty()) {
            userDtos = users.stream().map(user -> UserDto.builder()
                    .id(user.getId())
                    .dob(user.getDob())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .address(user.getAddress())
                    .createdAt(user.getCreatedAt())
                    .fullName(user.getFullName())
                    .isActive(user.getIsActive())
                    .updatedAt(user.getUpdatedAt())
                    .username(user.getUsername())
                    .build()).toList();
        }
        return userDtos;
    }

    @Transactional
    @Override
    public UserDto createUser(CreateUserRequest request) {
        User user = User.builder()
                .id(UUID.randomUUID())
                .username(request.getUsername())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .address(request.getAddress())
                .dob(request.getDob())
                .role(request.getRole())
                .isActive(request.getIsActive())
                .createdAt(getCurrentTime())
                .updatedAt(getCurrentTime())
                .build();

        User savedUser = userRepository.save(user);
        return UserMapper.INSTANCE.userToUserDto(savedUser);
    }

    @Override
    public UserDto updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ExistenceException("User not found!"));

        user.setPassword(request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : user.getPassword());
        user.setEmail(request.getEmail() != null ? request.getEmail() : user.getEmail());
        user.setPhone(request.getPhone() != null ? request.getPhone() : user.getPhone());
        user.setFullName(request.getFullName() != null ? request.getFullName() : user.getFullName());
        user.setAddress(request.getAddress() != null ? request.getAddress() : user.getAddress());
        user.setDob(request.getDob() != null ? request.getDob() : user.getDob());
        user.setRole(request.getRole() != null ? request.getRole() : user.getRole());
        user.setIsActive(request.getIsActive() != null ? request.getIsActive() : user.getIsActive());
        user.setUpdatedAt(getCurrentTime());

        User savedUser = userRepository.save(user);
        return UserDto.builder()
                .id(user.getId())
                .dob(user.getDob())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .address(user.getAddress())
                .createdAt(user.getCreatedAt())
                .fullName(user.getFullName())
                .isActive(user.getIsActive())
                .updatedAt(user.getUpdatedAt())
                .username(user.getUsername())
                .build();
    }

    @Transactional
    @Override
    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ExistenceException("User not found!");
        }
        userRepository.deleteById(userId);
    }
}
