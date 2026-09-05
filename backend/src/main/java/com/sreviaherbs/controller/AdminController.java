package com.sreviaherbs.controller;

import com.sreviaherbs.dto.ApiResponseDto;
import com.sreviaherbs.dto.PaymentUpdateDto;
import com.sreviaherbs.dto.StatusUpdateDto;
import com.sreviaherbs.model.AuditLog;
import com.sreviaherbs.model.Order;
import com.sreviaherbs.model.Product;
import com.sreviaherbs.service.AuditLogService;
import com.sreviaherbs.service.DatabaseBackupService;
import com.sreviaherbs.service.OrderService;
import com.sreviaherbs.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private DatabaseBackupService databaseBackupService;

    // Order Management APIs
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderService.getOrderByOrderId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/orders/{orderId}/payment")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable String orderId,
            @RequestBody PaymentUpdateDto payload) {

        Optional<Order> updated = orderService.updatePaymentStatus(orderId, payload.getStatus(), payload.getRejectionReason());
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody StatusUpdateDto payload) {

        Optional<Order> updated = orderService.updateOrderStatus(orderId, payload.getOrderStatus());
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/google-sheets/retry/{orderId}")
    public ResponseEntity<ApiResponseDto<Void>> retryGoogleSheetsSync(@PathVariable String orderId) {
        boolean success = orderService.retryGoogleSheetsSync(orderId);
        if (success) {
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Google Sheets sync completed successfully"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(false, "Google Sheets sync failed. Please check server logs.", "SYNC_FAILED"));
        }
    }

    // Product Management CRUD APIs
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product saved = productService.saveProduct(product);
        auditLogService.logAction("PRODUCT_CREATED", "Kathirvelan Admin", "Created product: " + saved.getName(), "127.0.0.1");
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        Product saved = productService.saveProduct(product);
        auditLogService.logAction("PRODUCT_UPDATED", "Kathirvelan Admin", "Updated product ID: " + id, "127.0.0.1");
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        auditLogService.logAction("PRODUCT_DELETED", "Kathirvelan Admin", "Deleted product ID: " + id, "127.0.0.1");
        return ResponseEntity.ok(new ApiResponseDto<>(true, "Product deleted successfully"));
    }

    // Audit Logs API
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogService.getRecentLogs());
    }

    // Database Backup API
    @GetMapping("/backup")
    public ResponseEntity<Map<String, Object>> downloadDatabaseBackup() {
        auditLogService.logAction("DATABASE_BACKUP_GENERATED", "Kathirvelan Admin", "Generated full database JSON backup", "127.0.0.1");
        return ResponseEntity.ok(databaseBackupService.generateBackupSnapshot());
    }
}
