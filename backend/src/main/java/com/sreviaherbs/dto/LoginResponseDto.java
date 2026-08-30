package com.sreviaherbs.dto;

public class LoginResponseDto {
    private boolean success;
    private String token;
    private String message;

    public LoginResponseDto() {}

    public LoginResponseDto(boolean success, String token, String message) {
        this.success = success;
        this.token = token;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
