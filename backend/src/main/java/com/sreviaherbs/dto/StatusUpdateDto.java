package com.sreviaherbs.dto;

public class StatusUpdateDto {
    private String status;
    private String orderStatus;
    private String trackingNumber;
    private String courier;
    private String message;
    private String changedBy;

    public StatusUpdateDto() {}

    public String getStatus() {
        return status != null ? status : orderStatus;
    }
    public void setStatus(String status) { this.status = status; }

    public String getOrderStatus() {
        return orderStatus != null ? orderStatus : status;
    }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCourier() { return courier; }
    public void setCourier(String courier) { this.courier = courier; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
}
