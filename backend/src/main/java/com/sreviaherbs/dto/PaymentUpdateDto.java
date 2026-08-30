package com.sreviaherbs.dto;

public class PaymentUpdateDto {
    private String status; // 'VERIFIED' or 'REJECTED'
    private String rejectionReason;

    public PaymentUpdateDto() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
