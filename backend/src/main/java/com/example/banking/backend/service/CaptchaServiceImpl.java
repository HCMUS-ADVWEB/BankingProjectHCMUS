package com.example.banking.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class CaptchaServiceImpl implements CaptchaService {

    @Value("${google.recaptcha.key.secret}")
    private String googleRecaptchaSecretKey;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public boolean verityCaptchaToken(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("secret", googleRecaptchaSecretKey);
            map.add("response", token);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
            ResponseEntity<String> response = restTemplate.postForEntity(VERIFY_URL, request, String.class);

            if (!response.getStatusCode().equals(HttpStatus.OK)) {
                return false;
            }
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            boolean success = responseJson.get("success").asBoolean();
            if (success) {
                return true;
            }
            if (responseJson.has("error-codes")) {
                log.warn("reCAPTCHA errors: {}", responseJson.get("error-codes").toString());
            }
            return false;
        } catch (Exception e) {
            log.warn("Error verifying reCAPTCHA: {}", e.getMessage());
            return false;
        }
    }
}
