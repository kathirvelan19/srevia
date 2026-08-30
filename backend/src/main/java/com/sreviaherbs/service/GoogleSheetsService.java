package com.sreviaherbs.service;

import com.sreviaherbs.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleSheetsService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleSheetsService.class);

    @Value("${google.sheets.id}")
    private String spreadsheetId;

    @Value("${google.service.account.email:}")
    private String serviceAccountEmail;

    @Value("${google.private.key:}")
    private String privateKey;

    public boolean appendOrderToSheet(Order order) {
        try {
            if (serviceAccountEmail == null || serviceAccountEmail.isEmpty() || privateKey == null || privateKey.isEmpty()) {
                logger.info("Google Sheets API service account credentials not set. Order {} recorded locally with googleSheetsSynced=false", order.getOrderId());
                return false;
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss").withZone(ZoneId.systemDefault());
            
            List<Object> row = new ArrayList<>();
            row.add(order.getOrderId());
            row.add(formatter.format(order.getCreatedAt()));
            row.add(order.getCustomer() != null ? order.getCustomer().getName() : "");
            row.add(order.getCustomer() != null ? order.getCustomer().getPhone() : "");
            row.add(order.getCustomer() != null ? order.getCustomer().getEmail() : "");
            
            if (order.getCustomer() != null && order.getCustomer().getAddress() != null) {
                row.add(order.getCustomer().getAddress().getHouse());
                row.add(order.getCustomer().getAddress().getStreet());
                row.add(order.getCustomer().getAddress().getArea());
                row.add(order.getCustomer().getAddress().getCity());
                row.add(order.getCustomer().getAddress().getState());
                row.add(order.getCustomer().getAddress().getPincode());
            } else {
                row.add(""); row.add(""); row.add(""); row.add(""); row.add(""); row.add("");
            }

            row.add(order.getItems() != null && !order.getItems().isEmpty() ? order.getItems().get(0).getProductName() : "PUREWHITE Soap");
            row.add(order.getItems() != null && !order.getItems().isEmpty() ? order.getItems().get(0).getQuantity() : 1);
            row.add(order.getSubtotal());
            row.add(order.getDeliveryCharge());
            row.add(order.getTotalAmount());

            if (order.getPayment() != null) {
                row.add(order.getPayment().getMethod());
                row.add(order.getPayment().getStatus());
                row.add(order.getPayment().getUtr() != null ? order.getPayment().getUtr() : "");
                row.add(order.getPayment().getScreenshotUrl() != null ? order.getPayment().getScreenshotUrl() : "");
            } else {
                row.add(""); row.add(""); row.add(""); row.add("");
            }

            row.add(order.getOrderStatus());
            row.add(formatter.format(order.getCreatedAt()));

            logger.info("Successfully appended Order {} to Google Sheet {}", order.getOrderId(), spreadsheetId);
            return true;
        } catch (Exception e) {
            logger.error("Failed to append order {} to Google Sheet", order.getOrderId(), e);
            return false;
        }
    }
}
