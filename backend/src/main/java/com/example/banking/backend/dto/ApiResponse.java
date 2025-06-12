package com.example.banking.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

        import java.time.LocalDateTime;
import java.time.ZoneId;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {

    private Integer status;

    private String message;

    private T data;

    @Builder.Default
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime timestamp = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));


    public String toJson() {
        LocalDateTime time = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        return "{"
                + "\"status\":" + status + ","
                + "\"message\":\"" + message + "\","
                + "\"data\":" + null + ","
                + "\"timestamp\":\"" + timestamp + "\""
                + "}";
    }
}
