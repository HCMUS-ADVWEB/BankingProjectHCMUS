package com.example.banking.backend;

import com.example.banking.backend.dto.request.account.AccountInfoRequest;
import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import com.example.banking.backend.util.CryptoUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@SpringBootApplication
@EnableFeignClients
public class BackendApplication {

    public static void main(String[] args) throws Exception {


        // FAKE TRANSFER REQUEST AND ACCOUNT INFO REQUEST  ,DO NOT DELETE THIS CODE
//        String secret_key = "fake_secret_key_hash";
//        String timeStampeString = String.valueOf(Instant.now().minus(Duration.ofMinutes(5)).toEpochMilli());
//        String BANK_CODE = "FAK";
//        InterbankTransferRequest request = new InterbankTransferRequest("123456", "9704214212222", 0.2,
//                "nhom 3");
//        String requestBody1 = request.toString();
//        AccountInfoRequest request1 = new AccountInfoRequest("9704214212222", "FIN");
//
//        // Đọc private key từ file
//        ObjectMapper objectMapper = new ObjectMapper();
//        String requestBody2 = objectMapper.writeValueAsString(request1);
//        String privateKeyPEM = Files.readString(
//                new ClassPathResource("keys/fake_key_pkcs8.pem").getFile().toPath()
//        );
//        PrivateKey privateKey = KeyFactory.getInstance("RSA").generatePrivate(
//                new PKCS8EncodedKeySpec(
//                        Base64.getDecoder().decode(privateKeyPEM.replaceAll("-----[\\w ]+-----|\n|\r", ""))));
//
//        // Tạo chữ ký
//        Signature signer = Signature.getInstance("SHA256withRSA");
//        signer.initSign(privateKey);
//        signer.update(requestBody1.getBytes());
//        byte[] signature = signer.sign();
//        String signatureBase64 = Base64.getEncoder().encodeToString(signature);
//
//        String hashInputTransfer = requestBody1 + timeStampeString + BANK_CODE + secret_key;
//        String hashInputAccount = requestBody2 + timeStampeString + BANK_CODE + secret_key;
//        String hmac = CryptoUtils.generateHMAC(hashInputTransfer, secret_key);
//        String hmac1= CryptoUtils.generateHMAC(hashInputAccount, secret_key);
//
//
//        // In ra kết quả
//
//        System.out.println("✅ X-Timestamp " + timeStampeString);
//        System.out.println("✅ X-Request-Hash: " + hmac);
//        System.out.println("✅ HMAC Account: " + hmac1);
//        System.out.println("✅ X-Signature " + signatureBase64);
        SpringApplication.run(BackendApplication.class, args);
    }

}
