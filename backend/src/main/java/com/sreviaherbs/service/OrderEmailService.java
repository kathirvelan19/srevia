package com.sreviaherbs.service;

import com.sreviaherbs.model.Order;
import com.sreviaherbs.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class OrderEmailService {

    private static final Logger logger = LoggerFactory.getLogger(OrderEmailService.class);

    private final EmailService emailService;
    private final OrderRepository orderRepository;

    public OrderEmailService(EmailService emailService, OrderRepository orderRepository) {
        this.emailService = emailService;
        this.orderRepository = orderRepository;
    }

    /**
     * Send Order Confirmation Email with Idempotency Guard
     */
    public synchronized boolean sendOrderConfirmation(Order order) {
        if (order == null || order.getOrderId() == null) {
            return false;
        }

        // Re-fetch latest state from DB to guarantee idempotency across concurrent webhooks/threads
        Optional<Order> dbOrderOpt = orderRepository.findByOrderId(order.getOrderId());
        Order targetOrder = dbOrderOpt.orElse(order);

        if (targetOrder.isEmailSent()) {
            logger.info("Order confirmation email already sent for order ID: {}. Skipping duplicate trigger.", targetOrder.getOrderId());
            return true;
        }

        boolean sent = emailService.sendOrderConfirmation(targetOrder);

        if (sent) {
            targetOrder.setEmailSent(true);
            targetOrder.setEmailSentAt(Instant.now());
            targetOrder.setEmailStatus("SENT");
            orderRepository.save(targetOrder);
            logger.info("Order confirmation email successfully marked SENT for order ID: {}", targetOrder.getOrderId());
        } else {
            targetOrder.setEmailStatus("FAILED");
            orderRepository.save(targetOrder);
            logger.warn("Order confirmation email failed for order ID: {}", targetOrder.getOrderId());
        }

        return sent;
    }

    /**
     * Send Order Status Update Email
     */
    public boolean sendOrderStatusUpdate(Order order, String newStatus, String statusNote) {
        if (order == null) return false;
        return emailService.sendOrderStatusUpdate(order, newStatus, statusNote);
    }
}
