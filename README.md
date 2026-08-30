# SREVIA HERBS — Full-Stack E-Commerce Website & Management System

Official full-stack e-commerce website and business order management system for **SREVIA HERBS** and its signature product **PUREWHITE Herbal Anti-Pimple Soap**.

---

## 🍃 Brand Visual Identity & Aesthetics
- **Theme**: Modern-Traditional Luxury Indian Herbal Skincare Aesthetic
- **Typography**: Poppins (Clean, modern sans-serif across all elements)
- **Color Palette**:
  - Background: Pure Warm Ivory (`#FCFBF7`)
  - Primary Green: Forest Herbal Green (`#315C45`)
  - Deep Green: Midnight Botanical (`#1F3D2E`)
  - Sage: Soft Leaf Sage (`#A8B9A3`)
  - Accent Gold: Subtle Muted Gold (`#B89B5E`)

---

## 📞 Official Business & Owner Contact
- **Owner / Contact Person**: Kathirvelan
- **Phone / WhatsApp**: +91 9025132739
- **Email Address**: kathirvelankvr@gmail.com
- **UPI VPA**: 9025132739@upi

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + PostCSS + Poppins Font
- **Icons**: Lucide React
- **Payments**: Razorpay Checkout SDK + Manual UPI QR Upload

### Backend
- **Framework**: Java 17 / 25 + Spring Boot 3
- **Database**: MongoDB (Spring Data MongoDB)
- **Security**: Spring Security + JWT Admin Authentication + BCrypt
- **Cloud Storage**: Cloudinary SDK (Payment proof screenshots & media)
- **Data Integration**: Google Sheets API v4 (Automated order row sync with fallback & retry support)
- **Payment Verification**: Razorpay HMAC-SHA256 server-side signature verification

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React frontend will start at `http://localhost:5173` (or active Vite port).

### 2. Backend Setup
```bash
cd backend
# Make sure MongoDB is running on mongodb://localhost:27017/sreviaherbs
mvn spring-boot:run
```
The Spring Boot REST API will start at `http://localhost:8080`.

---

## 📑 Admin Access Credentials
- **Admin Portal URL**: `http://localhost:5173/admin/login`
- **Default Email**: `kathirvelankvr@gmail.com`
- **Default Password**: `admin123`

---

## 🔄 End-to-End Order Workflow
```
Customer Browses Store → Selects Quantity (₹149 / soap) → Clicks BUY NOW 
  → 3-Step Responsive Checkout (Summary → Address Validation → Payment Choice)
  → Razorpay Payment OR Manual UPI QR Scan (with UTR ID & Screenshot Upload)
  → Spring Boot REST API Validates Payload
  → Image Uploaded to Cloudinary
  → Unique Order ID Generated (SRV-YYYYMMDD-XXXX)
  → Order Saved in MongoDB
  → Order Row Appended to Google Sheets
  → Customer Redirected to /order-success
  → Real-Time Timeline Tracking at /track-order (Order ID + Phone)
  → Admin Reviews & Verifies Payment at /admin/orders
  → Admin Updates Order Status (CONFIRMED → PROCESSING → PACKED → SHIPPED → DELIVERED)
```
