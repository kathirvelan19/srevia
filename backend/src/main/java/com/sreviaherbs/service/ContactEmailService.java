package com.sreviaherbs.service;

import com.sreviaherbs.model.ContactMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ContactEmailService {

    private static final Logger logger = LoggerFactory.getLogger(ContactEmailService.class);

    private final EmailService emailService;

    public ContactEmailService(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Dispatch Customer Receipt & Admin Notification for Contact Form Submission
     */
    public void processContactFormEmails(ContactMessage message) {
        try {
            // 1. Send Customer Acknowledgement
            boolean customerSent = emailService.sendContactAcknowledgement(message);
            logger.info("Customer acknowledgement email for message ID {}: {}", message.getId(), customerSent ? "SUCCESS" : "FAILED");

            // 2. Send Admin Notification
            boolean adminSent = emailService.sendAdminNewMessageNotification(message);
            logger.info("Admin notification email for message ID {}: {}", message.getId(), adminSent ? "SUCCESS" : "FAILED");
        } catch (Exception e) {
            logger.error("Error processing contact form emails for message ID {}", message.getId(), e);
        }
    }
}
