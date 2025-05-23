package com.example.banking.backend.model;

import com.example.banking.backend.model.type.FeeType;
import com.example.banking.backend.model.type.TransactionStatusType;
import com.example.banking.backend.model.type.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @ColumnDefault("gen_random_uuid()")
    @Column(name = "transaction_id", nullable = false)
    private UUID id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 50)
    private TransactionType transactionType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_bank_id")
    private Bank fromBank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;

    @Size(max = 255)
    @Column(name = "from_account_number")
    private String fromAccountNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_bank_id")
    private Bank toBank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id")
    private Account toAccount;

    @Column(name = "to_account_number")
    private String toAccountNumber;

    @NotNull
    @Column(name = "amount", nullable = false)
    private Double amount;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "fee", nullable = false)
    private Double fee;

    @NotNull
    @ColumnDefault("'SENDER'")
    @Enumerated(EnumType.STRING)
    @Column(name = "fee_type", nullable = false, length = 10)
    private FeeType feeType;

    @NotNull
    @ColumnDefault("'PENDING'")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransactionStatusType status;

    @Column(name = "message", length = Integer.MAX_VALUE)
    private String message;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToOne(mappedBy = "transaction")
    private DebtReminder debtReminder;
}