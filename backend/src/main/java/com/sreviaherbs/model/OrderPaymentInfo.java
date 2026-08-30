package com.sreviaherbs.model;

public class OrderPaymentInfo {
    private String method; // 'RAZORPAY' or 'UPI_QR'
    private String status; // 'PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'
    private String utr;
    private String screenshotUrl;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String rejectionReason;

    public OrderPaymentInfo() {}

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUtr() { return utr; }
    public void setUtr(String utr) { this.utr = utr; }

    public String getScreenshotUrl() { return screenshotUrl; }
    public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
