package com.sreviaherbs.service;

import com.sreviaherbs.model.ContactMessage;
import com.sreviaherbs.model.Order;
import com.sreviaherbs.model.OrderItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${mail.api.key:}")
    private String mailApiKey;

    @Value("${mail.from:SREVIA HERBS <onboarding@resend.dev>}")
    private String mailFrom;

    @Value("${admin.email:kathirvelankvr@gmail.com}")
    private String adminEmail;

    @Value("${app.website.url:http://localhost:5181}")
    private String websiteUrl;

    private final EmailTemplateService templateService;
    private final RestTemplate restTemplate;

    public EmailService(EmailTemplateService templateService) {
        this.templateService = templateService;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Send email via Resend REST API
     */
    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        if (mailApiKey == null || mailApiKey.trim().isEmpty()) {
            logger.warn("Resend API key is missing. Skipping email delivery to: {}", toEmail);
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(mailApiKey.trim());

            Map<String, Object> payload = new HashMap<>();
            payload.put("from", mailFrom);
            payload.put("to", new String[]{ toEmail.trim() });
            payload.put("subject", subject);
            payload.put("html", htmlContent);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.exchange(RESEND_API_URL, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Email sent successfully via Resend to: {} | Subject: {}", toEmail, subject);
                return true;
            } else {
                logger.error("Resend API returned non-success code: {} | Response: {}", response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (Exception e) {
            logger.error("Failed to send email via Resend to: {} | Error: {}", toEmail, e.getMessage());
            return false;
        }
    }

    /**
     * Send Customer Contact Message Acknowledgement
     */
    public boolean sendContactAcknowledgement(ContactMessage message) {
        if (message == null || message.getEmail() == null || message.getEmail().trim().isEmpty()) {
            logger.warn("Cannot send contact acknowledgement: missing email.");
            return false;
        }

        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("CUSTOMER_NAME", message.getName() != null && !message.getName().trim().isEmpty() ? message.getName().trim() : "Valued Customer");
        placeholders.put("CUSTOMER_EMAIL", message.getEmail().trim());
        placeholders.put("SUBJECT", message.getSubject() != null && !message.getSubject().trim().isEmpty() ? message.getSubject().trim() : "Product Enquiry");
        placeholders.put("MESSAGE", message.getMessage() != null ? message.getMessage().trim() : "");
        placeholders.put("MESSAGE_ID", message.getId() != null ? message.getId() : "MSG-" + System.currentTimeMillis());
        placeholders.put("WEBSITE_URL", websiteUrl);
        placeholders.put("CONTACT_URL", websiteUrl + "/contact");

        String html = templateService.loadAndRenderTemplate("message-received.html", placeholders);
        String subject = "Message Received — SREVIA HERBS";

        return sendEmail(message.getEmail(), subject, html);
    }

    /**
     * Send Admin Notification for New Contact Message
     */
    public boolean sendAdminNewMessageNotification(ContactMessage message) {
        if (adminEmail == null || adminEmail.trim().isEmpty()) {
            logger.warn("Admin email is not configured. Skipping admin message alert.");
            return false;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a").withZone(ZoneId.systemDefault());

        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("MESSAGE_ID", message.getId() != null ? message.getId() : "MSG-" + System.currentTimeMillis());
        placeholders.put("CUSTOMER_NAME", message.getName() != null ? message.getName().trim() : "Anonymous");
        placeholders.put("CUSTOMER_EMAIL", message.getEmail() != null ? message.getEmail().trim() : "no-email");
        placeholders.put("SUBJECT", message.getSubject() != null && !message.getSubject().trim().isEmpty() ? message.getSubject().trim() : "Product Enquiry");
        placeholders.put("CREATED_AT", message.getCreatedAt() != null ? formatter.format(message.getCreatedAt()) : "Just now");
        placeholders.put("MESSAGE", message.getMessage() != null ? message.getMessage().trim() : "");

        String html = templateService.loadAndRenderTemplate("admin-new-message.html", placeholders);
        String subject = "New Customer Message — SREVIA HERBS";

        return sendEmail(adminEmail, subject, html);
    }

    /**
     * Send Order Confirmation Email
     */
    public boolean sendOrderConfirmation(Order order) {
        if (order == null || order.getCustomer() == null || order.getCustomer().getEmail() == null || order.getCustomer().getEmail().trim().isEmpty()) {
            logger.warn("Order has no customer email. Skipping confirmation email.");
            return false;
        }

        String customerEmail = order.getCustomer().getEmail().trim();
        String customerName = order.getCustomer().getName() != null ? order.getCustomer().getName().trim() : "Customer";
        String trackUrl = websiteUrl + "/track-order?orderId=" + order.getOrderId();

        // Build HTML table for order items
        StringBuilder itemsHtml = new StringBuilder();
        String mainProductName = "PUREWHITE Herbal Anti-Pimple Soap";
        String mainProductDesc = "Herbal Anti-Pimple Soap";
        int mainProductQty = 1;
        long mainProductTotal = (long) order.getTotalAmount();

        List<OrderItem> items = order.getItems();
        if (items != null && !items.isEmpty()) {
            OrderItem firstItem = items.get(0);
            mainProductName = firstItem.getProductName() != null ? firstItem.getProductName() : mainProductName;
            mainProductQty = firstItem.getQuantity() > 0 ? firstItem.getQuantity() : 1;
            mainProductTotal = (long) firstItem.getTotalPrice();

            for (OrderItem item : items) {
                itemsHtml.append("<div class=\"item-row\">")
                         .append("<span><strong>").append(item.getProductName()).append("</strong> × ").append(item.getQuantity()).append("</span>")
                         .append("<span>₹").append((long) item.getTotalPrice()).append("</span>")
                         .append("</div>");
            }
        }

        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("CUSTOMER_NAME", customerName);
        placeholders.put("CUSTOMER_EMAIL", customerEmail);
        placeholders.put("ORDER_ID", order.getOrderId());
        placeholders.put("PRODUCT_NAME", mainProductName);
        placeholders.put("PRODUCT_DESCRIPTION", mainProductDesc);
        placeholders.put("QUANTITY", String.valueOf(mainProductQty));
        placeholders.put("ITEM_TOTAL", "₹" + mainProductTotal);
        placeholders.put("ITEMS_HTML", itemsHtml.toString());
        placeholders.put("SUBTOTAL", String.valueOf((long) order.getSubtotal()));
        placeholders.put("DELIVERY", order.getDeliveryCharge() == 0 ? "Free" : "₹" + (long) order.getDeliveryCharge());
        placeholders.put("DELIVERY_TEXT", order.getDeliveryCharge() == 0 ? "Free" : "₹" + (long) order.getDeliveryCharge());
        placeholders.put("TOTAL", String.valueOf((long) order.getTotalAmount()));
        placeholders.put("PAYMENT_STATUS", order.getPayment() != null && order.getPayment().getStatus() != null ? order.getPayment().getStatus() : "PAID");
        placeholders.put("TRACK_ORDER_URL", trackUrl);
        placeholders.put("WEBSITE_URL", websiteUrl);
        placeholders.put("CONTACT_URL", websiteUrl + "/contact");

        String html = templateService.loadAndRenderTemplate("order-confirmation.html", placeholders);
        String subject = "Payment Successful — SREVIA HERBS Order #" + order.getOrderId();

        return sendEmail(customerEmail, subject, html);
    }

    /**
     * Send Order Status Update Email
     */
    public boolean sendOrderStatusUpdate(Order order, String newStatus, String statusNote) {
        if (order == null || order.getCustomer() == null || order.getCustomer().getEmail() == null || order.getCustomer().getEmail().trim().isEmpty()) {
            return false;
        }

        String customerEmail = order.getCustomer().getEmail().trim();
        String trackUrl = websiteUrl + "/track-order?orderId=" + order.getOrderId();

        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("CUSTOMER_NAME", order.getCustomer().getName() != null ? order.getCustomer().getName().trim() : "Customer");
        placeholders.put("ORDER_ID", order.getOrderId());
        placeholders.put("ORDER_STATUS", newStatus);
        placeholders.put("STATUS_MESSAGE", statusNote != null ? statusNote : "Your order status has been updated to " + newStatus);
        placeholders.put("TRACK_ORDER_URL", trackUrl);

        String html = templateService.loadAndRenderTemplate("order-status.html", placeholders);
        String subject = "Order Status Update #" + order.getOrderId() + " — " + newStatus;

        return sendEmail(customerEmail, subject, html);
    }
}
