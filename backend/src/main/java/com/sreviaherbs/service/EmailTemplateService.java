package com.sreviaherbs.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class EmailTemplateService {

    private static final Logger logger = LoggerFactory.getLogger(EmailTemplateService.class);

    public String loadAndRenderTemplate(String templateName, Map<String, String> placeholders) {
        try {
            ClassPathResource resource = new ClassPathResource("email/" + templateName);
            String templateContent = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

            for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                String key = "{{" + entry.getKey() + "}}";
                String value = entry.getValue() != null ? entry.getValue() : "";
                templateContent = templateContent.replace(key, value);
            }

            return templateContent;
        } catch (IOException e) {
            logger.error("Failed to load email template: {}", templateName, e);
            throw new RuntimeException("Email template missing or unreadable: " + templateName, e);
        }
    }
}
