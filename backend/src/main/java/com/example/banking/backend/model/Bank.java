package com.example.banking.backend.model;

import com.example.banking.backend.model.type.BankSecurityType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "banks")
public class Bank {
    @Id
    @ColumnDefault("gen_random_uuid()")
    @Column(name = "bank_id", nullable = false)
    private UUID id;

    @NotNull
    @Column(name = "bank_code", nullable = false, length = 50)
    private String bankCode;

    @NotNull
    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @NotNull
    @Column(name = "public_key", nullable = false, length = Integer.MAX_VALUE)
    private String publicKey;

    @NotNull
    @Column(name = "api_endpoint", nullable = false)
    private String apiEndpoint;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "security_type", nullable = false, length = 10)
    private BankSecurityType securityType;

    @NotNull
    @Column(name = "secret_key", nullable = false)
    private String secretKey;

    @NotNull
    @ColumnDefault("true")
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "bank")
    private Set<Recipient> recipients = new LinkedHashSet<>();

    @OneToMany(mappedBy = "fromBank")
    private Set<Transaction> transactionsAsSender = new LinkedHashSet<>();

    @OneToMany(mappedBy = "toBank")
    private Set<Transaction> transactionsAsReceiver = new LinkedHashSet<>();
}