package com.sreviaherbs.service;

import com.sreviaherbs.model.AuditLog;
import com.sreviaherbs.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogService.class);

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String action, String performedBy, String details, String ipAddress) {
        try {
            AuditLog log = new AuditLog(action, performedBy, details, ipAddress);
            auditLogRepository.save(log);
            logger.info("AUDIT LOG [{}] by {}: {}", action, performedBy, details);
        } catch (Exception e) {
            logger.warn("Failed to write audit log entry", e);
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
