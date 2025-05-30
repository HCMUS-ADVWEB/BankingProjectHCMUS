package com.example.banking.backend.service;

import com.example.banking.backend.exception.BadRequestException;
import com.example.banking.backend.model.type.OtpType;
import com.example.banking.backend.util.AppConstants;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.time.Year;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine emailTemplateEngine;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Override
    public void sendOtpEmail(String to, String otp, OtpType otpType) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            Context context = new Context();
            context.setVariable("recipientEmail", to);
            context.setVariable("otpCode", otp);
            context.setVariable("purpose", otpType.getDisplayName());
            context.setVariable("purposeIcon", otpType.getIcon());
            context.setVariable("currentYear", Year.now().getValue());
            context.setVariable("expirationMinutes", AppConstants.OTP_EXPIRATION_MINUTES);

            String htmlContent = emailTemplateEngine.process("email-otp", context);

            helper.setTo(to);
            helper.setFrom(fromEmail, fromName);
            helper.setSubject("🔐 Mã OTP cho " + otpType.getDisplayName());
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Error sending OTP email to: {}", to, e);
            throw new BadRequestException("Failed to send OTP email");
        }
    }
}
