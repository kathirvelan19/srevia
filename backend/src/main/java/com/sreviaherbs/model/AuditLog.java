package com.sreviaherbs.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String id;
    private String action; // PRICE_CHANGE, STOCK_TOGGLE, ORDER_STATUS_UPDATE, PAYMENT_VERIFICATION, LOGIN
    private String performedBy; // Email or Admin Username
    private String details;
    private String ipAddress;
    private Instant timestamp = Instant.now();

    public AuditLog() {}

    public AuditLog(String action, String performedBy, String details, String ipAddress) {
        this.action = action;
        this.performedBy = performedBy;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
