package com.sreviaherbs.model;

import com.sreviaherbs.util.JsonConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id = UUID.randomUUID().toString();

    private String name;
    private String tagline;
    private double price;
    private double originalPrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int stockQuantity;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.StringListConverter.class)
    private List<String> benefits;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonConverter.IngredientListConverter.class)
    private List<IngredientItem> ingredients;

    private boolean active = true;

    public Product() {}

    public Product(String id, String name, String tagline, double price, String description, int stockQuantity, String image, List<String> benefits, List<IngredientItem> ingredients, boolean active) {
        this.id = (id != null && !id.trim().isEmpty()) ? id : UUID.randomUUID().toString();
        this.name = name;
        this.tagline = tagline;
        this.price = price;
        this.description = description;
        this.stockQuantity = stockQuantity;
        this.image = image;
        this.benefits = benefits;
        this.ingredients = ingredients;
        this.active = active;
    }

    public static class IngredientItem {
        private String name;
        private String shortDesc;
        private String traditionalSignificance;
        private String skincareRole;

        public IngredientItem() {}

        public IngredientItem(String name, String shortDesc, String traditionalSignificance, String skincareRole) {
            this.name = name;
            this.shortDesc = shortDesc;
            this.traditionalSignificance = traditionalSignificance;
            this.skincareRole = skincareRole;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getShortDesc() { return shortDesc; }
        public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

        public String getTraditionalSignificance() { return traditionalSignificance; }
        public void setTraditionalSignificance(String traditionalSignificance) { this.traditionalSignificance = traditionalSignificance; }

        public String getSkincareRole() { return skincareRole; }
        public void setSkincareRole(String skincareRole) { this.skincareRole = skincareRole; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getBenefits() { return benefits; }
    public void setBenefits(List<String> benefits) { this.benefits = benefits; }

    public List<IngredientItem> getIngredients() { return ingredients; }
    public void setIngredients(List<IngredientItem> ingredients) { this.ingredients = ingredients; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
