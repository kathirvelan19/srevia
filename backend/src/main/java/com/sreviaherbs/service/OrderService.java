package com.sreviaherbs.service;

import com.sreviaherbs.model.Order;
import com.sreviaherbs.model.OrderItem;
import com.sreviaherbs.model.Product;
import com.sreviaherbs.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private GoogleSheetsService googleSheetsService;

    @Autowired
    private OrderEmailService orderEmailService;

    @Autowired
    private AuditLogService auditLogService;

    public Order createOrder(Order order) {
        // 1. Server-Side Stock & Price Validation (Prevents Price/Stock Tampering)
        List<Product> products = productService.getAllProducts();
        double activePrice = 80.0; // Default fallback price
        boolean isAvailable = true;

        if (!products.isEmpty()) {
            Product dbProduct = products.get(0);
            activePrice = dbProduct.getPrice() > 0 ? dbProduct.getPrice() : 80.0;
            isAvailable = dbProduct.isActive() && dbProduct.getStockQuantity() > 0;
        }

        if (!isAvailable) {
            logger.warn("Order placement rejected: PUREWHITE Soap is out of stock.");
            throw new IllegalStateException("PUREWHITE Soap is currently Out of Stock (Unavailable). New order placement is temporarily paused.");
        }

        // 2. Server-side Recalculation of Line Items & Totals
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            double calculatedSubtotal = 0.0;
            for (OrderItem item : order.getItems()) {
                int qty = item.getQuantity() > 0 ? item.getQuantity() : 1;
                item.setQuantity(qty);
                item.setUnitPrice(activePrice);
                double lineTotal = activePrice * qty;
                item.setTotalPrice(lineTotal);
                calculatedSubtotal += lineTotal;
            }
            order.setSubtotal(calculatedSubtotal);
            double deliveryCharge = calculatedSubtotal > 499.0 ? 0.0 : 49.0;
            order.setDeliveryCharge(deliveryCharge);
            order.setTotalAmount(calculatedSubtotal + deliveryCharge);
        } else {
            order.setSubtotal(activePrice);
            order.setDeliveryCharge(49.0);
            order.setTotalAmount(activePrice + 49.0);
        }

        // 3. Generate unique order ID if not set
        if (order.getOrderId() == null || order.getOrderId().trim().isEmpty()) {
            order.setOrderId(generateUniqueOrderId());
        }

        if (order.getOrderStatus() == null || order.getOrderStatus().trim().isEmpty()) {
            order.setOrderStatus("PLACED");
        }

        // Initialize status history if empty
        if (order.getStatusHistory() == null) {
            order.setStatusHistory(new java.util.ArrayList<>());
        }
        if (order.getStatusHistory().isEmpty()) {
            order.getStatusHistory().add(new com.sreviaherbs.model.OrderStatusHistory(
                    order.getOrderId(),
                    order.getOrderStatus(),
                    "Order placed successfully by customer",
                    "CUSTOMER"
            ));
        }

        // 4. Save order to MongoDB
        Order savedOrder = orderRepository.save(order);
        logger.info("Order saved securely with server-calculated total ₹{} for Order ID: {}", savedOrder.getTotalAmount(), savedOrder.getOrderId());

        // Trigger confirmation email if payment is already VERIFIED or PAID
        if (savedOrder.getPayment() != null &&
            ("VERIFIED".equalsIgnoreCase(savedOrder.getPayment().getStatus()) || "PAID".equalsIgnoreCase(savedOrder.getPayment().getStatus()))) {
            try {
                orderEmailService.sendOrderConfirmation(savedOrder);
            } catch (Exception e) {
                logger.error("Failed to process order email confirmation for order {}", savedOrder.getOrderId(), e);
            }
        }

        // Attempt Google Sheets Sync
        try {
            boolean synced = googleSheetsService.appendOrderToSheet(savedOrder);
            if (synced != savedOrder.isGoogleSheetsSynced()) {
                savedOrder.setGoogleSheetsSynced(synced);
                savedOrder = orderRepository.save(savedOrder);
            }
        } catch (Exception e) {
            logger.error("Google Sheets sync failed for order {}", savedOrder.getOrderId(), e);
        }

        return savedOrder;
    }

    public static boolean isValidTransition(String currentStatus, String targetStatus) {
        if (currentStatus == null || targetStatus == null) return false;
        String from = currentStatus.toUpperCase().trim();
        String to = targetStatus.toUpperCase().trim();

        if (from.equals(to)) return true; // Idempotent updates allowed

        switch (from) {
            case "PLACED":
            case "ORDER_PLACED":
            case "ORDER_RECEIVED":
            case "PAYMENT_SUBMITTED":
            case "PAYMENT_PENDING":
            case "SUBMITTED":
                return to.equals("CONFIRMED") || to.equals("CANCELLED") || to.equals("PAYMENT_FAILED");

            case "CONFIRMED":
                return to.equals("PROCESSING") || to.equals("CANCELLED");

            case "PROCESSING":
                return to.equals("PACKED") || to.equals("CANCELLED");

            case "PACKED":
                return to.equals("SHIPPED") || to.equals("CANCELLED");

            case "SHIPPED":
                return to.equals("OUT_FOR_DELIVERY");

            case "OUT_FOR_DELIVERY":
                return to.equals("DELIVERED");

            case "DELIVERED":
                return to.equals("RETURN_REQUESTED");

            case "RETURN_REQUESTED":
                return to.equals("RETURNED");

            case "RETURNED":
                return to.equals("REFUNDED");

            case "PAYMENT_FAILED":
                return to.equals("PLACED") || to.equals("CANCELLED");

            case "CANCELLED":
            case "REFUNDED":
                return false; // Terminal states

            default:
                return true;
        }
    }

    public Optional<Order> getOrderByOrderId(String orderId) {
        return orderRepository.findByOrderId(orderId);
    }

    public Optional<Order> trackOrder(String orderId, String phone) {
        Optional<Order> orderOpt = orderRepository.findByOrderId(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if (phone == null || phone.trim().isEmpty()) {
                return Optional.of(order);
            }
            if (order.getCustomer() != null && order.getCustomer().getPhone() != null) {
                String cleanPhone = phone.trim().replaceAll("\\D", "");
                String storedPhone = order.getCustomer().getPhone().trim().replaceAll("\\D", "");
                if (storedPhone.endsWith(cleanPhone) || cleanPhone.endsWith(storedPhone)) {
                    return Optional.of(order);
                }
            }
        }
        return Optional.empty();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> updatePaymentStatus(String orderId, String status, String rejectionReason) {
        Optional<Order> orderOpt = orderRepository.findByOrderId(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if (order.getPayment() != null) {
                order.getPayment().setStatus(status);
                if (rejectionReason != null) {
                    order.getPayment().setRejectionReason(rejectionReason);
                }
            }
            if ("VERIFIED".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status)) {
                if (isValidTransition(order.getOrderStatus(), "CONFIRMED")) {
                    order.setOrderStatus("CONFIRMED");
                    if (order.getStatusHistory() == null) order.setStatusHistory(new java.util.ArrayList<>());
                    order.getStatusHistory().add(new com.sreviaherbs.model.OrderStatusHistory(
                            orderId, "CONFIRMED", "Payment verified by Admin", "ADMIN"
                    ));
                }
            }
            order.setUpdatedAt(Instant.now());
            Order updated = orderRepository.save(order);

            // Audit Log Event
            auditLogService.logAction("PAYMENT_VERIFICATION", "Kathirvelan Admin", "Order " + orderId + " payment status updated to " + status, "127.0.0.1");

            // Send Confirmation Email if verified/paid (idempotent)
            if ("VERIFIED".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status)) {
                try {
                    orderEmailService.sendOrderConfirmation(updated);
                } catch (Exception e) {
                    logger.error("Failed to send order confirmation email for verified order {}", updated.getOrderId(), e);
                }
            }

            // Re-sync with Google Sheets
            try {
                boolean synced = googleSheetsService.appendOrderToSheet(updated);
                if (synced != updated.isGoogleSheetsSynced()) {
                    updated.setGoogleSheetsSynced(synced);
                    updated = orderRepository.save(updated);
                }
            } catch (Exception e) {
                logger.error("Google Sheets sync failed for order {}", updated.getOrderId(), e);
            }

            return Optional.of(updated);
        }
        return Optional.empty();
    }

    public Optional<Order> updateOrderStatus(String orderId, String status) {
        return updateOrderStatus(orderId, status, null, null, null, "ADMIN");
    }

    public Optional<Order> updateOrderStatus(String orderId, String targetStatus, String trackingNumber, String courier, String message, String changedBy) {
        Optional<Order> orderOpt = orderRepository.findByOrderId(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            String currentStatus = order.getOrderStatus() != null ? order.getOrderStatus() : "PLACED";

            if (!isValidTransition(currentStatus, targetStatus)) {
                logger.warn("Invalid status transition attempt for order {}: {} -> {}", orderId, currentStatus, targetStatus);
                throw new IllegalArgumentException("Invalid status transition from " + currentStatus + " to " + targetStatus);
            }

            order.setOrderStatus(targetStatus.toUpperCase());
            if (trackingNumber != null && !trackingNumber.trim().isEmpty()) {
                order.setTrackingNumber(trackingNumber.trim());
            }
            if (courier != null && !courier.trim().isEmpty()) {
                order.setCourier(courier.trim());
            }
            order.setUpdatedAt(Instant.now());

            if (order.getStatusHistory() == null) {
                order.setStatusHistory(new java.util.ArrayList<>());
            }
            String historyMsg = message != null && !message.trim().isEmpty()
                    ? message.trim()
                    : "Order status updated to " + targetStatus.toUpperCase();
            order.getStatusHistory().add(new com.sreviaherbs.model.OrderStatusHistory(
                    orderId, targetStatus.toUpperCase(), historyMsg, changedBy != null ? changedBy : "ADMIN"
            ));

            Order saved = orderRepository.save(order);

            // Audit Log Event
            auditLogService.logAction("ORDER_STATUS_UPDATE", changedBy != null ? changedBy : "Kathirvelan Admin", "Order " + orderId + " status updated to " + targetStatus, "127.0.0.1");

            // Send Order Status Update Email
            try {
                orderEmailService.sendOrderStatusUpdate(saved, targetStatus, historyMsg);
            } catch (Exception e) {
                logger.error("Failed to send order status update email for order {}", saved.getOrderId(), e);
            }

            return Optional.of(saved);
        }
        return Optional.empty();
    }

    public Optional<Order> cancelOrder(String orderId, String reason, String changedBy) {
        return updateOrderStatus(orderId, "CANCELLED", null, null, reason != null ? reason : "Order cancelled", changedBy);
    }

    public Optional<Order> requestReturn(String orderId, String reason, String changedBy) {
        return updateOrderStatus(orderId, "RETURN_REQUESTED", null, null, reason != null ? reason : "Return requested by customer", changedBy);
    }

    public Optional<Order> refundOrder(String orderId, String reason, String changedBy) {
        return updateOrderStatus(orderId, "REFUNDED", null, null, reason != null ? reason : "Order refunded", changedBy);
    }

    public boolean retryGoogleSheetsSync(String orderId) {
        Optional<Order> orderOpt = orderRepository.findByOrderId(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            boolean synced = googleSheetsService.appendOrderToSheet(order);
            if (synced) {
                order.setGoogleSheetsSynced(true);
                orderRepository.save(order);
            }
            return synced;
        }
        return false;
    }

    private synchronized String generateUniqueOrderId() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd").withZone(ZoneId.of("Asia/Kolkata"));
        String dateStr = dtf.format(Instant.now());
        Random random = new Random();
        int randomNum = 1000 + random.nextInt(9000);
        String candidate = "SRV-" + dateStr + "-" + randomNum;

        while (orderRepository.findByOrderId(candidate).isPresent()) {
            randomNum = 1000 + random.nextInt(9000);
            candidate = "SRV-" + dateStr + "-" + randomNum;
        }

        return candidate;
    }
}
