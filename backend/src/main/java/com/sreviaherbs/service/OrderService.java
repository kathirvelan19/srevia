package com.sreviaherbs.service;

import com.sreviaherbs.model.Order;
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
    private GoogleSheetsService googleSheetsService;

    @Autowired
    private OrderEmailService orderEmailService;

    public Order createOrder(Order order) {
        // Generate unique order ID if not set
        if (order.getOrderId() == null || order.getOrderId().trim().isEmpty()) {
            order.setOrderId(generateUniqueOrderId());
        }

        // Save order to MongoDB
        Order savedOrder = orderRepository.save(order);
        logger.info("Order saved successfully in MongoDB with ID: {}", savedOrder.getOrderId());

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
                order.setOrderStatus("CONFIRMED");
            }
            order.setUpdatedAt(Instant.now());
            Order updated = orderRepository.save(order);

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
        Optional<Order> orderOpt = orderRepository.findByOrderId(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setOrderStatus(status);
            order.setUpdatedAt(Instant.now());
            Order saved = orderRepository.save(order);

            // Send Order Status Update Email
            try {
                orderEmailService.sendOrderStatusUpdate(saved, status, "Your SREVIA HERBS order #" + saved.getOrderId() + " status is now " + status);
            } catch (Exception e) {
                logger.error("Failed to send order status update email for order {}", saved.getOrderId(), e);
            }

            return Optional.of(saved);
        }
        return Optional.empty();
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
