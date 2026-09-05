package com.sreviaherbs.service;

import com.sreviaherbs.model.AuditLog;
import com.sreviaherbs.model.Order;
import com.sreviaherbs.model.Product;
import com.sreviaherbs.repository.AuditLogRepository;
import com.sreviaherbs.repository.OrderRepository;
import com.sreviaherbs.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DatabaseBackupService {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseBackupService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public Map<String, Object> generateBackupSnapshot() {
        logger.info("Generating Database Backup Snapshot...");
        Map<String, Object> backupData = new HashMap<>();
        
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        List<AuditLog> auditLogs = auditLogRepository.findTop50ByOrderByTimestampDesc();

        backupData.put("timestamp", Instant.now().toString());
        backupData.put("version", "1.0");
        backupData.put("productsCount", products.size());
        backupData.put("ordersCount", orders.size());
        backupData.put("auditLogsCount", auditLogs.size());
        backupData.put("products", products);
        backupData.put("orders", orders);
        backupData.put("auditLogs", auditLogs);

        logger.info("Database Backup Snapshot generated successfully with {} products and {} orders.", products.size(), orders.size());
        return backupData;
    }
}
