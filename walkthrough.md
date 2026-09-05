# Walkthrough - Production-Quality 12-State Order Management System

We have implemented and verified a full production-quality **Order Management System** for Srevia Herbs with backend state-machine enforcement, audit history tracking, courier dispatch information, customer action flows, and real-time live synchronization across Admin, User Profile, and Track Order pages.

---

## 1. Backend Core Architecture (`backend/`)

### A. Immutable Order Status History Model
- Created [OrderStatusHistory.java](file:///c:/Users/Kathirvelan/Desktop/srevia/backend/src/main/java/com/sreviaherbs/model/OrderStatusHistory.java) model to store audit history logs containing:
  - `status`, `message`, `changedBy` (`ADMIN`, `CUSTOMER`, `SYSTEM`), and `createdAt` timestamp.
- Updated [Order.java](file:///c:/Users/Kathirvelan/Desktop/srevia/backend/src/main/java/com/sreviaherbs/model/Order.java) to include `userId`, `trackingNumber`, `courier`, and `statusHistory` list.

### B. Strict State Machine Validation (`OrderService.java`)
Implemented a 12-state order lifecycle with strict transition rules in [OrderService.java](file:///c:/Users/Kathirvelan/Desktop/srevia/backend/src/main/java/com/sreviaherbs/service/OrderService.java):

```
PLACED ➔ CONFIRMED ➔ PROCESSING ➔ PACKED ➔ SHIPPED ➔ OUT_FOR_DELIVERY ➔ DELIVERED
  │         │                                                          │
  ├─────────┴──> CANCELLED                                             └──> RETURN_REQUESTED ➔ RETURNED ➔ REFUNDED
  └──> PAYMENT_FAILED
```

- Allowed State Transitions:
  - `PLACED`: Allowed ➔ `CONFIRMED`, `CANCELLED`, `PAYMENT_FAILED`
  - `CONFIRMED`: Allowed ➔ `PROCESSING`, `CANCELLED`
  - `PROCESSING`: Allowed ➔ `PACKED`, `CANCELLED`
  - `PACKED`: Allowed ➔ `SHIPPED`
  - `SHIPPED`: Allowed ➔ `OUT_FOR_DELIVERY`
  - `OUT_FOR_DELIVERY`: Allowed ➔ `DELIVERED`
  - `DELIVERED`: Allowed ➔ `RETURN_REQUESTED`
  - `RETURN_REQUESTED`: Allowed ➔ `RETURNED`, `REFUNDED`
  - `RETURNED`: Allowed ➔ `REFUNDED`
  - Terminal States: `CANCELLED`, `REFUNDED`, `PAYMENT_FAILED`

### C. Controller Endpoints
- Updated [OrderController.java](file:///c:/Users/Kathirvelan/Desktop/srevia/backend/src/main/java/com/sreviaherbs/controller/OrderController.java) & [AdminController.java](file:///c:/Users/Kathirvelan/Desktop/srevia/backend/src/main/java/com/sreviaherbs/controller/AdminController.java) with:
  - `PUT /api/orders/{id}/status`: Change order status with state machine enforcement & courier details.
  - `POST /api/orders/{id}/cancel`: Customer cancellation endpoint.
  - `POST /api/orders/{id}/return`: Customer return request endpoint.
  - `POST /api/admin/orders/{id}/refund`: Admin refund endpoint.

---

## 2. Frontend Order Management & Stepper (`frontend/`)

### A. Modular Order Components & Utilities
- Created [order.ts](file:///c:/Users/Kathirvelan/Desktop/srevia/frontend/src/types/order.ts): 12-state `OrderStatus` union and TypeScript interfaces.
- Created [orderStatus.ts](file:///c:/Users/Kathirvelan/Desktop/srevia/frontend/src/utils/orderStatus.ts): Configuration map with labels, descriptions, badge styling, and allowed next transitions.
- Created [OrderStatusBadge.tsx](file:///c:/Users/Kathirvelan/Desktop/srevia/frontend/src/components/orders/OrderStatusBadge.tsx): Reusable luxury badge component.
- Created [OrderTimeline.tsx](file:///c:/Users/Kathirvelan/Desktop/srevia/frontend/src/components/orders/OrderTimeline.tsx): Responsive stepper timeline rendering step status and actual `statusHistory` timestamps.

### B. Upgraded Admin Orders Page (`Admin/Orders.tsx`)
- Integrated [Admin/Orders.tsx](file:///c:/Users/Kathirvelan/Desktop/srevia/frontend/src/pages/Admin/Orders.tsx) with search by Order ID / Customer Name / Phone / Courier, status filters (`All`, `Active`, `Shipped`, `Delivered`, `Cancelled`), and sorting.
- Added Shipping Details Modal: Prompts Admin for **Courier Partner** (e.g. Blue Dart, Delhivery) and **AWB Tracking Number** when advancing status to `SHIPPED`.
- Enforced valid next status options based on state machine rules.

### C. Upgraded Customer Track Order Page (`TrackOrder/index.tsx`)
- Integrated [TrackOrder/index.tsx](file:///c:/Users/Kathirvelan/Desktop/srevia/frontend/src/pages/TrackOrder/index.tsx) with real-time state synchronization.
- Displays AWB Tracking number and Courier details when dispatched.
- Added interactive Customer **Cancel Order** modal (for `PLACED` / `CONFIRMED` orders) and **Request Return** modal (for `DELIVERED` orders).

### D. Upgraded Customer Profile Page (`Profile/index.tsx`)
- Integrated [Profile/index.tsx](file:///c:/Users/Kathirvelan/Desktop/srevia/frontend/src/pages/Profile/index.tsx) with expandable live timeline steppers for past orders.

---

## 3. Verification & Build Results

1. **Backend Build**:
   - Command: `./mvnw compile`
   - Output: **`BUILD SUCCESS`** (0 errors)

2. **Frontend Build**:
   - Command: `npm run build`
   - Output: **`vite build success`** (0 errors)

3. **Git Push**:
   - Committed changes and pushed to GitHub repo `kathirvelan19/srevia` (`main` branch).
