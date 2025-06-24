package com.example.banking.backend.dto.response.transaction;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Setter
@Getter
@Schema(name = "BankStatistics",
        description = "Return bank's (or all banks') transaction statistics")
public class BankTransactionStatsDto {
    @Schema(description = "Total transactions made",
            example = "1000")
    private Long totalTransactions;

    @Schema(description = "Total amount of money transferred",
            example = "250000000")
    private Double totalAmount;

    @Schema(description = "Statistics is from this date")
    private LocalDateTime startDate;

    @Schema(description = "Statistics is to this date")
    private LocalDateTime endDate;


}