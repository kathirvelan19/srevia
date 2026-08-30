package com.sreviaherbs.config;

import com.sreviaherbs.model.Product;
import com.sreviaherbs.model.User;
import com.sreviaherbs.repository.ProductRepository;
import com.sreviaherbs.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedProducts();
            seedAdminUser();
        } catch (Exception e) {
            logger.warn("Data initialization encountered non-fatal notice (MongoDB may be in offline fallback mode): {}", e.getMessage());
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<String> benefits = Arrays.asList(
                    "Herbal-inspired formulation for gentle everyday cleansing",
                    "Helps cleanse pores and remove excess oil naturally",
                    "Supports a fresh, clean, radiant skin feel",
                    "Crafted with carefully selected traditional botanicals",
                    "Free from harsh sulfates, artificial dyes, and parabens"
            );

            List<Product.IngredientItem> ingredients = Arrays.asList(
                    new Product.IngredientItem("Organic Neem (Azadirachta Indica)", "Purifying botanical powerhouse", "Revered in Ayurvedic wisdom for thousands of years as nature’s ultimate skin purifier.", "Deeply cleanses dirt, absorbs excess sebum, and keeps skin feeling fresh and clear."),
                    new Product.IngredientItem("Holy Basil Tulsi (Ocimum Sanctum)", "Soothing & protective herb", "Known as the Queen of Herbs, celebrated for its antioxidant and soothing properties.", "Helps calm tired skin, protects against environmental stressors, and restores natural radiance."),
                    new Product.IngredientItem("Cold-Pressed Virgin Coconut Oil", "Deep natural hydration", "Traditional Indian beauty ritual essential for soft, resilient skin.", "Creates a rich, creamy lather that nourishes skin without stripping natural moisture."),
                    new Product.IngredientItem("Pure Plant Glycerin", "Moisture lock humectant", "Derived from natural plant oils to preserve moisture balance.", "Draws hydration into skin layers, preventing tightness after everyday cleansing."),
                    new Product.IngredientItem("Natural Herbal Fragrance", "Calming botanical aroma", "A subtle blend of therapeutic essential oils.", "Delivers a soothing, aromatic bath experience.")
            );

            Product purewhite = new Product(
                    "prod_purewhite_01",
                    "PUREWHITE Herbal Anti-Pimple Soap",
                    "Pure Skin. Pure Care. PureWhite.",
                    149.00,
                    "A traditional herbal-inspired cleansing soap formulated with pure Neem, Tulsi, virgin Coconut Oil, and organic Glycerin. Designed for gentle everyday skincare, leaving your skin fresh, radiant, and deeply cleansed.",
                    100,
                    "/assets/purewhite_soap_bar.jpg",
                    benefits,
                    ingredients,
                    true
            );

            productRepository.save(purewhite);
            logger.info("Seeded initial product: PUREWHITE Herbal Anti-Pimple Soap (₹149)");
        }
    }

    private void seedAdminUser() {
        String adminEmail = "kathirvelankvr@gmail.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User(adminEmail, passwordEncoder.encode("admin123"), "ADMIN");
            userRepository.save(admin);
            logger.info("Seeded default admin user: kathirvelankvr@gmail.com");
        }
    }
}
