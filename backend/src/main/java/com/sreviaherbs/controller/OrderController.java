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
            @RequestParam String phone) {

        Optional<Order> orderOpt = orderService.trackOrder(orderId, phone);
        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(orderOpt.get());
        }
        return ResponseEntity.status(404).body(new ApiResponseDto<>(false, "Order not found or phone number mismatch", "ORDER_NOT_FOUND"));
    }
}
