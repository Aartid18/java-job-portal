package com.jobportal.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Dev-friendly mailer: logs verification / reset links.
 * Swap for JavaMailSender when SMTP is configured.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        log.info("[EMAIL:VERIFY] to={} link={}", toEmail, link);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        log.info("[EMAIL:RESET] to={} link={}", toEmail, link);
    }
}
