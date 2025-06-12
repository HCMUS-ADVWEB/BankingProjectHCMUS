package com.example.banking.backend.util;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class CryptoUtils {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    public static PrivateKey loadPrivateKey(String filePath) throws Exception {
        String privateKeyPEM = Files.readString(Path.of(filePath))
                .replaceAll("\\s+", "")
                .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "");
        byte[] decodedKey = Base64.getDecoder().decode(privateKeyPEM);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(new PKCS8EncodedKeySpec(decodedKey));
    }

    public static PublicKey loadPublicKey(String publicKeyPEM) throws Exception {
        String publicKeyContent = publicKeyPEM.replaceAll("\\n", "")
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "");
        byte[] decodedKey = Base64.getDecoder().decode(publicKeyContent);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(new X509EncodedKeySpec(decodedKey));
    }

    public static String signData(String data, PrivateKey privateKey) throws Exception {
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(data.getBytes());
        byte[] signatureBytes = signature.sign();
        return Base64.getEncoder().encodeToString(signatureBytes);
    }

    public static boolean verifySignature(String data, String signature, PublicKey publicKey) throws Exception {
        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(publicKey);
        sig.update(data.getBytes());
        byte[] signatureBytes = Base64.getDecoder().decode(signature);
        return sig.verify(signatureBytes);
    }

    public static String generateHMAC(String data, String secretKey) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hmacBytes = mac.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(hmacBytes);
    }
}
