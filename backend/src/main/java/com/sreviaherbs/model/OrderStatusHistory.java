package com.sreviaherbs.model;

import java.time.Instant;

public class OrderStatusHistory {

    private String id;
    private String orderId;
    private String status;
    private String message;
    private String changedBy;
    private Instant createdAt = Instant.now();

    public OrderStatusHistory() {}

    public OrderStatusHistory(String orderId, String status, String message, String changedBy) {
        this.id = java.util.UUID.randomUUID().toString();
        this.orderId = orderId;
        this.status = status;
        this.message = message;
        this.changedBy = changedBy;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
