package com.sreviaherbs.controller;

import com.sreviaherbs.dto.LoginRequestDto;
import com.sreviaherbs.dto.LoginResponseDto;
import com.sreviaherbs.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        Optional<String> tokenOpt = authService.login(request.getEmail(), request.getPassword());

        if (tokenOpt.isPresent()) {
            return ResponseEntity.ok(new LoginResponseDto(true, tokenOpt.get(), "Login successful"));
        } else {
            return ResponseEntity.status(401).body(new LoginResponseDto(false, null, "Invalid admin credentials"));
        }
    }
}
