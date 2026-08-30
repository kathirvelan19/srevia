package com.sreviaherbs.controller;

import com.sreviaherbs.dto.ApiResponseDto;
import com.sreviaherbs.model.ContactMessage;
import com.sreviaherbs.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponseDto<ContactMessage>> submitMessage(@RequestBody ContactMessage message) {
        ContactMessage saved = contactService.saveMessage(message);
        return ResponseEntity.ok(new ApiResponseDto<>(true, "Message sent successfully!", saved));
    }
}
