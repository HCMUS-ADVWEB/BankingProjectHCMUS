package com.example.banking.backend.util;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

import com.example.banking.backend.dto.request.transaction.InterbankTransferRequest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class SignatureUtil {

    public static String signData(InterbankTransferRequest request) throws Exception {

        String requestBody = request.toString();

        // Đọc private key từ file
        String privateKeyPEM = Files.readString(
                new ClassPathResource("keys/private_key_pkcs8.pem").getFile().toPath()
        );
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
}