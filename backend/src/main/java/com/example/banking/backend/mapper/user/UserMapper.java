package com.example.banking.backend.mapper.user;

import com.example.banking.backend.dto.request.user.UpdateUserRequest;
import com.example.banking.backend.dto.response.user.UserDto;
import com.example.banking.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto userToUserDto(User user);

    UpdateUserRequest userToUpdateUserRequest(User user);
}
