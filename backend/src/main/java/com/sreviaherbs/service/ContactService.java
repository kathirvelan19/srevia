package com.sreviaherbs.service;

import com.sreviaherbs.model.ContactMessage;
import com.sreviaherbs.repository.ContactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactEmailService contactEmailService;

    public ContactMessage saveMessage(ContactMessage message) {
        ContactMessage saved = contactRepository.save(message);

        // Asynchronously or safely trigger Resend emails
        try {
            contactEmailService.processContactFormEmails(saved);
        } catch (Exception e) {
            logger.error("Error triggering contact emails for message ID {}", saved.getId(), e);
        }

        return saved;
    }

    public List<ContactMessage> getAllMessages() {
        return contactRepository.findAll();
    }
}
