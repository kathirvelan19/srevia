package com.sreviaherbs.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sreviaherbs.model.CustomerInfo;
import com.sreviaherbs.model.OrderItem;
import com.sreviaherbs.model.OrderPaymentInfo;
import com.sreviaherbs.model.OrderStatusHistory;
import com.sreviaherbs.model.Product.IngredientItem;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

public class JsonConverter {

    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @Converter
    public static class StringListConverter implements AttributeConverter<List<String>, String> {
        @Override
        public String convertToDatabaseColumn(List<String> attribute) {
            if (attribute == null) return "[]";
            try {
                return objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return "[]";
            }
        }

        @Override
        public List<String> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return new ArrayList<>();
            try {
                return objectMapper.readValue(dbData, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
    }

    @Converter
    public static class IngredientListConverter implements AttributeConverter<List<IngredientItem>, String> {
        @Override
        public String convertToDatabaseColumn(List<IngredientItem> attribute) {
            if (attribute == null) return "[]";
            try {
                return objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return "[]";
            }
        }

        @Override
        public List<IngredientItem> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return new ArrayList<>();
            try {
                return objectMapper.readValue(dbData, new TypeReference<List<IngredientItem>>() {});
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
    }

    @Converter
    public static class CustomerInfoConverter implements AttributeConverter<CustomerInfo, String> {
        @Override
        public String convertToDatabaseColumn(CustomerInfo attribute) {
            if (attribute == null) return null;
            try {
                return objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return null;
            }
        }

        @Override
        public CustomerInfo convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return null;
            try {
                return objectMapper.readValue(dbData, CustomerInfo.class);
            } catch (Exception e) {
                return null;
            }
        }
    }

    @Converter
    public static class OrderItemConverter implements AttributeConverter<List<OrderItem>, String> {
        @Override
        public String convertToDatabaseColumn(List<OrderItem> attribute) {
            if (attribute == null) return "[]";
            try {
                return objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return "[]";
            }
        }

        @Override
        public List<OrderItem> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return new ArrayList<>();
            try {
                return objectMapper.readValue(dbData, new TypeReference<List<OrderItem>>() {});
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
    }

    @Converter
    public static class PaymentInfoConverter implements AttributeConverter<OrderPaymentInfo, String> {
        @Override
        public String convertToDatabaseColumn(OrderPaymentInfo attribute) {
            if (attribute == null) return null;
            try {
                return objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return null;
            }
        }

        @Override
        public OrderPaymentInfo convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return null;
            try {
                return objectMapper.readValue(dbData, OrderPaymentInfo.class);
            } catch (Exception e) {
                return null;
            }
        }
    }

    @Converter
    public static class StatusHistoryConverter implements AttributeConverter<List<OrderStatusHistory>, String> {
        @Override
        public String convertToDatabaseColumn(List<OrderStatusHistory> attribute) {
            if (attribute == null) return "[]";
            try {
                return objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return "[]";
            }
        }

        @Override
        public List<OrderStatusHistory> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return new ArrayList<>();
            try {
                return objectMapper.readValue(dbData, new TypeReference<List<OrderStatusHistory>>() {});
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
    }
}
