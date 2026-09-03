package com.sreviaherbs.controller;

import com.sreviaherbs.model.Product;
import com.sreviaherbs.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

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

        List<Product> products = productService.getAllProducts();
        if (!products.isEmpty()) {
            Product p = products.get(0);
            if (inStock != null) {
                p.setActive(inStock);
                p.setStockQuantity(inStock ? 100 : 0);
            }
            if (price != null) {
                p.setPrice(price);
            }
            productService.saveProduct(p);
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.ok().build();
    }
}
