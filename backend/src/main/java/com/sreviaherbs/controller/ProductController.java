package com.sreviaherbs.controller;

import com.sreviaherbs.model.Product;
import com.sreviaherbs.service.AuditLogService;
import com.sreviaherbs.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/status")
    public ResponseEntity<?> updateStockStatus(@RequestBody java.util.Map<String, Object> payload) {
        Boolean inStock = (Boolean) payload.get("inStock");
        Double price = payload.get("price") != null ? Double.valueOf(payload.get("price").toString()) : null;
        Double originalPrice = payload.get("originalPrice") != null ? Double.valueOf(payload.get("originalPrice").toString()) : null;

        List<Product> products = productService.getAllProducts();
        Product p;
        if (!products.isEmpty()) {
            p = products.get(0);
        } else {
            p = new Product();
            p.setId("prod_purewhite_01");
            p.setName("PUREWHITE Herbal Anti-Pimple Soap");
            p.setTagline("Where Purity Meets Beauty");
            p.setPrice(80.0);
            p.setOriginalPrice(120.0);
            p.setStockQuantity(100);
            p.setActive(true);
        }

        double oldPrice = p.getPrice();
        boolean oldStock = p.isActive() && p.getStockQuantity() > 0;

        if (inStock != null) {
            p.setActive(inStock);
            p.setStockQuantity(inStock ? 100 : 0);
        }
        if (price != null) {
            p.setPrice(price);
        }
        if (originalPrice != null) {
            p.setOriginalPrice(originalPrice);
        }
        Product saved = productService.saveProduct(p);

        // Audit log recording
        String logDetails = String.format("Stock: %s -> %s | Price: ₹%.2f -> ₹%.2f",
                oldStock ? "IN_STOCK" : "OUT_OF_STOCK",
                saved.isActive() ? "IN_STOCK" : "OUT_OF_STOCK",
                oldPrice, saved.getPrice());
        try {
            auditLogService.logAction("PRODUCT_STATUS_UPDATE", "Kathirvelan Admin", logDetails, "127.0.0.1");
        } catch (Exception ignored) {}

        return ResponseEntity.ok(saved);
    }
}
