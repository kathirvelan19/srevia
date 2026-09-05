package com.sreviaherbs.model;

import com.sreviaherbs.util.JsonConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id = UUID.randomUUID().toString();

    @Column(unique = true, nullable = false)
    private String orderId;

    private String userId;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.CustomerInfoConverter.class)
    private CustomerInfo customer;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.OrderItemConverter.class)
    private List<OrderItem> items = new ArrayList<>();

    private double subtotal;
    private double deliveryCharge;
    private double totalAmount;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.PaymentInfoConverter.class)
    private OrderPaymentInfo payment;

    private String orderStatus;

    private String trackingNumber;
    private String courier;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.StatusHistoryConverter.class)
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();

    private boolean googleSheetsSynced = false;

    private boolean emailSent = false;
    private Instant emailSentAt;
    private String emailStatus = "PENDING";

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Order() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public CustomerInfo getCustomer() { return customer; }
    public void setCustomer(CustomerInfo customer) { this.customer = customer; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(double deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public OrderPaymentInfo getPayment() { return payment; }
    public void setPayment(OrderPaymentInfo payment) { this.payment = payment; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCourier() { return courier; }
    public void setCourier(String courier) { this.courier = courier; }

    public List<OrderStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<OrderStatusHistory> statusHistory) { this.statusHistory = statusHistory; }

    public boolean isGoogleSheetsSynced() { return googleSheetsSynced; }
    public void setGoogleSheetsSynced(boolean googleSheetsSynced) { this.googleSheetsSynced = googleSheetsSynced; }

    public boolean isEmailSent() { return emailSent; }
    public void setEmailSent(boolean emailSent) { this.emailSent = emailSent; }

    public Instant getEmailSentAt() { return emailSentAt; }
    public void setEmailSentAt(Instant emailSentAt) { this.emailSentAt = emailSentAt; }

    public String getEmailStatus() { return emailStatus; }
    public void setEmailStatus(String emailStatus) { this.emailStatus = emailStatus; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
