package com.example.banking.backend.dto;

import com.example.banking.backend.dto.response.account.GetAccountTransactionsResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

        import java.time.LocalDateTime;
import java.time.ZoneId;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Schema(description = "Where contains responses")
public class ApiResponse<T> {

    @Schema(description = "Response's status",
            example = "200")
    private Integer status;

    @Schema(description = "Response's additional message",
            example = "Data's fetched successfully")
    private String message;

    @Schema(description = "Response's main data")
    private T data;

    @Builder.Default
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    @Schema(description = "Response's timestamp")
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
