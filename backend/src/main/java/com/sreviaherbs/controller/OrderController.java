package com.sreviaherbs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sreviaherbs.dto.ApiResponseDto;
import com.sreviaherbs.model.Order;
import com.sreviaherbs.service.CloudinaryService;
import com.sreviaherbs.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<?> createOrder(
            @RequestPart(value = "order", required = false) String orderJson,
            @RequestPart(value = "screenshot", required = false) MultipartFile screenshot,
            @RequestBody(required = false) Order directOrderPayload) {

        try {
            Order order;
            if (directOrderPayload != null) {
                order = directOrderPayload;
            } else if (orderJson != null) {
                order = objectMapper.readValue(orderJson, Order.class);
            } else {
                return ResponseEntity.badRequest().body(new ApiResponseDto<>(false, "Order payload missing"));
            }

            // Handle optional screenshot upload via Cloudinary
            if (screenshot != null && !screenshot.isEmpty()) {
                String screenshotUrl = cloudinaryService.uploadImage(screenshot);
                if (order.getPayment() != null) {
                    order.getPayment().setScreenshotUrl(screenshotUrl);
                }
            }

            Order savedOrder = orderService.createOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            logger.error("Failed to process order creation", e);
            return ResponseEntity.internalServerError().body(new ApiResponseDto<>(false, "Order creation failed: " + e.getMessage(), "ORDER_CREATION_FAILED"));
        }
    }

    @GetMapping("/{orderId}/track")
    public ResponseEntity<?> trackOrder(
            @PathVariable String orderId,
            @RequestParam(required = false, defaultValue = "") String phone) {

        Optional<Order> orderOpt = orderService.trackOrder(orderId, phone);
        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(orderOpt.get());
        }
        return ResponseEntity.status(404).body(new ApiResponseDto<>(false, "Order not found or phone number mismatch", "ORDER_NOT_FOUND"));
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable String orderId) {
        Optional<Order> orderOpt = orderService.getOrderByOrderId(orderId);
        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(orderOpt.get());
        }
        return ResponseEntity.status(404).body(new ApiResponseDto<>(false, "Order not found", "ORDER_NOT_FOUND"));
    }

    @PutMapping("/{orderId}/status")
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String orderId,
            @RequestBody com.sreviaherbs.dto.StatusUpdateDto payload) {
        try {
            String targetStatus = payload.getStatus();
            if (targetStatus == null || targetStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponseDto<>(false, "Status is required"));
            }
            Optional<Order> updated = orderService.updateOrderStatus(
                    orderId,
                    targetStatus,
                    payload.getTrackingNumber(),
                    payload.getCourier(),
                    payload.getMessage(),
                    payload.getChangedBy() != null ? payload.getChangedBy() : "ADMIN"
            );
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            }
            return ResponseEntity.status(404).body(new ApiResponseDto<>(false, "Order not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(false, e.getMessage(), "INVALID_TRANSITION"));
        }
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable String orderId,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        try {
            String reason = body != null ? body.get("reason") : "Order cancelled by customer";
            String changedBy = body != null && body.get("changedBy") != null ? body.get("changedBy") : "CUSTOMER";
            Optional<Order> updated = orderService.cancelOrder(orderId, reason, changedBy);
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            }
            return ResponseEntity.status(404).body(new ApiResponseDto<>(false, "Order not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(false, e.getMessage(), "INVALID_TRANSITION"));
        }
    }

    @PostMapping("/{orderId}/return")
    public ResponseEntity<?> requestReturn(
            @PathVariable String orderId,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        try {
            String reason = body != null ? body.get("reason") : "Return requested by customer";
            String changedBy = body != null && body.get("changedBy") != null ? body.get("changedBy") : "CUSTOMER";
            Optional<Order> updated = orderService.requestReturn(orderId, reason, changedBy);
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            }
            return ResponseEntity.status(404).body(new ApiResponseDto<>(false, "Order not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(false, e.getMessage(), "INVALID_TRANSITION"));
        }
    }
}
