package com.sreviaherbs.dto;

public class ApiResponseDto<T> {
    private boolean success;
    private String message;
    private String errorCode;
    private T data;

    public ApiResponseDto() {}

    public ApiResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ApiResponseDto(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponseDto(boolean success, String message, String errorCode) {
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
