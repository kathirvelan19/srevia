package com.sreviaherbs.controller;

import com.sreviaherbs.dto.ApiResponseDto;
import com.sreviaherbs.model.Order;
import com.sreviaherbs.model.Product;
import com.sreviaherbs.service.OrderService;
import com.sreviaherbs.service.ProductService;
import com.sreviaherbs.service.RazorpayService;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/razorpay")
public class RazorpayController {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayController.class);

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, String>> createOrder(@RequestBody Map<String, Object> data) {
        // Server-Side Stock & Price Validation
        List<Product> products = productService.getAllProducts();
        double activePrice = 80.0;
        boolean isAvailable = true;

        if (!products.isEmpty()) {
            Product p = products.get(0);
            activePrice = p.getPrice() > 0 ? p.getPrice() : 80.0;
            isAvailable = p.isActive() && p.getStockQuantity() > 0;
        }

        if (!isAvailable) {
            throw new IllegalStateException("PUREWHITE Soap is currently Out of Stock (Unavailable). New Razorpay payments paused.");
        }

        double amount = activePrice + (activePrice > 499.0 ? 0.0 : 49.0);
        if (data.get("amount") != null) {
            double reqAmount = Double.parseDouble(data.get("amount").toString());
            if (reqAmount >= activePrice) {
                amount = reqAmount;
            }
        }

        Map<String, String> orderResult = razorpayService.createOrder(amount);
        return ResponseEntity.ok(orderResult);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> data) {
        String razorpayOrderId = data.get("razorpayOrderId");
        String razorpayPaymentId = data.get("razorpayPaymentId");
        String razorpaySignature = data.get("razorpaySignature");
        String orderId = data.get("orderId");

        boolean isValid = razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (isValid && orderId != null && !orderId.trim().isEmpty()) {
            Optional<Order> updatedOrder = orderService.updatePaymentStatus(orderId.trim(), "PAID", null);
            return ResponseEntity.ok(Map.of("valid", true, "orderConfirmed", updatedOrder.isPresent()));
        }

        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleRazorpayWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody String rawPayload) {

        logger.info("Received Razorpay Webhook Event.");

        try {
            JSONObject payloadJson = new JSONObject(rawPayload);
            String event = payloadJson.optString("event");

            if ("payment.captured".equalsIgnoreCase(event) || "order.paid".equalsIgnoreCase(event)) {
                JSONObject payloadObj = payloadJson.optJSONObject("payload");
                if (payloadObj != null) {
                    JSONObject paymentEntity = payloadObj.optJSONObject("payment");
                    JSONObject entityObj = paymentEntity != null ? paymentEntity.optJSONObject("entity") : null;

                    String rzpOrderId = entityObj != null ? entityObj.optString("order_id") : null;
                    JSONObject notesObj = entityObj != null ? entityObj.optJSONObject("notes") : null;
                    String sreviaOrderId = notesObj != null ? notesObj.optString("order_id") : null;

                    logger.info("Processing webhook payment event: {} for Order: {}", event, sreviaOrderId != null ? sreviaOrderId : rzpOrderId);

                    if (sreviaOrderId != null && !sreviaOrderId.isEmpty()) {
                        orderService.updatePaymentStatus(sreviaOrderId, "PAID", null);
                    }
                }
            }

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Webhook processed successfully"));
        } catch (Exception e) {
            logger.error("Error processing Razorpay webhook", e);
            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDto<>(false, "Webhook error, acknowledged"));
        }
    }
}
