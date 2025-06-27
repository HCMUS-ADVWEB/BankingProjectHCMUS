package com.example.banking.backend.util;

import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;

@Component
public class SignatureUtil {

    public static String signData(InterbankTransferRequest request) throws Exception {

        String requestBody = request.toString();

        // Đọc private key từ file
        String privateKeyPEM = "" ;
        try (InputStream inputStream = new ClassPathResource("keys/private_key_pkcs8.pem").getInputStream()) {
             privateKeyPEM = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
        PrivateKey privateKey = KeyFactory.getInstance("RSA").generatePrivate(
                new PKCS8EncodedKeySpec(
                        Base64.getDecoder().decode(privateKeyPEM.replaceAll("-----[\\w ]+-----|\n|\r", ""))));

        // Tạo chữ ký
        Signature signer = Signature.getInstance("SHA256withRSA");
        signer.initSign(privateKey);
        signer.update(requestBody.getBytes());
        byte[] signature = signer.sign();
        String signatureBase64 = Base64.getEncoder().encodeToString(signature);
        return signatureBase64;
    }

    public static boolean isTimestampWithin5Minutes(String timestampStr) {
        try {
            long timestampMillis = Long.parseLong(timestampStr);
            LocalDateTime dateTime = Instant.ofEpochMilli(timestampMillis)
                    .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                    .toLocalDateTime();
            LocalDateTime now = LocalDateTime.now();
            Duration duration = Duration.between(dateTime, now).abs();

            System.out.println("duration.toSeconds() " + duration.toSeconds());

            return duration.toSeconds() <= 5 * 60;

        } catch (NumberFormatException e) {
            return false;
        }
    }
}