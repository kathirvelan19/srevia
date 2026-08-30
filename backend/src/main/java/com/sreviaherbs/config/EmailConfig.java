package com.sreviaherbs.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailConfig {

    private static final Logger logger = LoggerFactory.getLogger(EmailConfig.class);

    @Value("${mail.api.key:}")
    private String mailApiKey;

    @Value("${mail.from:SREVIA HERBS <onboarding@resend.dev>}")
    private String mailFrom;

    @Value("${admin.email:kathirvelankvr@gmail.com}")
    private String adminEmail;

    @Value("${app.website.url:http://localhost:5181}")
    private String websiteUrl;

    @PostConstruct
    public void validateConfiguration() {
        logger.info("Initializing SREVIA HERBS Email Service Configuration...");
        if (mailApiKey == null || mailApiKey.trim().isEmpty()) {
            logger.warn("CRITICAL: Resend API Key (MAIL_API_KEY) is NOT configured! Outbound email sending will be disabled.");
        } else {
            logger.info("Resend API Key loaded successfully. Sender: {}", mailFrom);
        }
        logger.info("Admin Email: {} | Website URL: {}", adminEmail, websiteUrl);
    }

    public String getMailApiKey() { return mailApiKey; }
    public String getMailFrom() { return mailFrom; }
    public String getAdminEmail() { return adminEmail; }
    public String getWebsiteUrl() { return websiteUrl; }
}
