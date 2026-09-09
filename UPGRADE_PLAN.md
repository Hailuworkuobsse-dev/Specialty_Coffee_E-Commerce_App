# Specialty Coffee Shop E-Commerce Platform - Comprehensive Upgrade Plan

**Document Version:** 2.0  
**Date:** September 9, 2026  
**Status:** Ready for Execution  
**Prepared By:** System Architecture Team  

---

## 1. Executive Summary

This document outlines the strategic roadmap to transform the current prototype into a production-grade, full-stack e-commerce platform capable of handling the expanded 100-product Ethiopian coffee portfolio across 10 categories.

The upgrade addresses **critical security vulnerabilities** (session ID leakage via URL parameters), implements **role-based access control** for five distinct user types, and establishes a scalable architecture using **Node.js, Express, Prisma ORM, and PostgreSQL**.

### 1.1 Critical Drivers

1.  **Security Remediation (CRITICAL):** Eliminate session IDs from URL query parameters immediately. Implement HTTP-only Secure Cookies as required by acceptance tests SEC-01, SC-05.
2.  **Data Scalability:** Migrate from basic JSON data to a relational database supporting complex product attributes (100 SKUs, 10 categories, stock tracking).
3.  **Role Management:** Implement granular permissions for Guests, Customers, Content Managers, Fulfillment Staff, and Admins per FUNCTIONAL_REQUIREMENTS.md Section 2.3.
4.  **Portfolio Expansion:** Support the new 10-category product structure including Green Beans, Confectionery, RTD, and Functional Blends.
5.  **Acceptance Test Compliance:** Address all Critical/High priority test cases in ACCEPTANCE_TEST_PLAN.md.

### 1.2 Current State Assessment

| Component | Current State | Gap Analysis |
| :--- | :--- | :--- |
| **Frontend** | React 18, LocalStorage session ID, no TypeScript | ❌ Missing HTTP-only cookie auth, TypeScript, React Query |
| **Backend** | Node.js/Express, basic routes | ❌ Missing auth middleware, RBAC, rate limiting, helmet |
| **Database** | MySQL with minimal schema | ❌ Missing User, Role, OrderItem tables; incomplete Product attributes |
| **Auth/Session** | Client-generated UUID in localStorage, passed as URL param | 🔴 **CRITICAL VULNERABILITY** - Must migrate to secure cookies |
| **Product Data** | Basic schema (id, name, description, price, image_url, category, stock) | ❌ Missing 28 product attributes per FR Section 2.1.3 |
| **Search** | Basic string matching | ❌ Missing PostgreSQL full-text search capabilities |
| **Checkout** | Basic order creation without transactions | ❌ Missing atomic transactions, inventory locking |

---

## 2. Phase 1: Foundation & Critical Security Remediation (Weeks 1-2)

**Goal:** Establish the secure backend skeleton and fix the critical session vulnerability (SEC-01, SC-05).

### 2.1 Task 1.1: Project Scaffolding & Tech Stack Initialization

*   **Action:** Initialize proper monorepo structure (`/client`, `/server`).
*   **Tech:** Node.js 18+, TypeScript (strict mode), ESLint, Prettier.
*   **Deliverable:** Buildable empty server and client connected via proxy.
*   **Acceptance Criteria:**
    *   `npm run dev` starts both frontend and backend concurrently.
    *   TypeScript strict mode enabled with zero errors.
    *   Frontend proxies API requests to backend during development.

### 2.2 Task 1.2: Database Schema Redesign & Migration

*   **Action:** Redefine Prisma Schema reflecting the 100-product portfolio and 5 user roles.
*   **Key Entities:** `User`, `Role`, `Product`, `Category`, `CartItem`, `Order`, `OrderItem`, `AuditLog`.
*   **Specifics:** 
    *   Add all 28 product attributes per FR Section 2.1.3: `origin`, `processMethod`, `roastLevel`, `grindType`, `flavorNotes`, `certifications`, `packagingType`, `weightVolume`, `shelfLife`, `storageRequirements`, `allergens`, `ingredients`, `nutritionalInfo`, `brewingRecommendations`, `sustainabilityScore`, `traceabilityData`, `functionalBenefits`, `grade`, `subcategory`, `isExportReady`, `minimumOrderQty`, `createdAt`, `updatedAt`.
    *   Create `Role` enum: `GUEST`, `CUSTOMER`, `MANAGER`, `FULFILLMENT`, `ADMIN`.
    *   Add `OrderItem` table linking orders to products with snapshot data.
    *   Add `AuditLog` table for admin actions (NFR-SEC-001, UR-SA-02).
*   **Deliverable:** `schema.prisma` file and initial migration SQL.
*   **Acceptance Criteria:**
    *   Database tables created successfully in PostgreSQL.
    *   Seed script generates all 100 products categorized correctly across 10 categories (DATA-01 through DATA-19).
    *   All product attributes from FR Section 2.1.3 are present.

### 2.3 Task 1.3: Secure Session Management Implementation (CRITICAL - SEC-01, SC-05)

*   **Action:** Replace URL-based session IDs with HTTP-only cookies.
*   **Implementation Details:**
    *   **Backend:** Install `cookie-parser` and `uuid`. Generate session ID on first request if cookie missing. Set cookie: `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800` (7 days).
    *   **Frontend:** Remove all `?sessionId=` logic from `api/client.js`. Configure Fetch `credentials: 'include'` on all requests. Remove localStorage session ID generation from `CartContext.jsx`.
    *   **Middleware:** Create `validateSession` middleware that reads from `req.cookies`, not `req.query`.
    *   **API Updates:** Update all cart endpoints to extract sessionId from cookies, not query params.
*   **Deliverable:** Working session middleware that persists cart state without URL params.
*   **Acceptance Criteria:**
    *   **Test SEC-01:** Inspecting browser Network tab shows NO session ID in URL.
    *   **Test SC-05:** Request Header contains session cookie; NO query param `?sessionId=`.
    *   **Test UR-G-04:** Refreshing page retains cart contents.
    *   **Test:** Copy-pasting URL to incognito window does NOT share the cart.

### 2.4 Task 1.4: Base API Structure & Error Handling

*   **Action:** Create global error handler and standard response wrapper.
*   **Spec:** Implement `ApiResponse<T>` interface `{ success: boolean, data?: T, error?: { code, message } }`.
*   **Deliverable:** Standardized 400/401/403/404/500 handlers.
*   **Acceptance Criteria:** All endpoints return consistent JSON structure even on failure.

---

## 3. Phase 2: Core Product Catalog & Search (Weeks 3-4)

**Goal:** Serve the expanded 100-product portfolio with high-performance filtering.

### 3.1 Task 2.1: Product Repository & Service Layer

*   **Action:** Implement Prisma services for `getProducts`, `getProductById`, `getCategories`, `getOrigins`, `getProcessMethods`.
*   **Logic:** Handle complex filtering (Origin + Process + Roast + Category + Certification + Dietary).
*   **Deliverable:** `ProductService` with typed methods.
*   **Acceptance Criteria:** API returns correct subsets when filtering by multiple criteria (e.g., "Guji" + "Natural" + "Green Bean") per FP-02, FP-03, FP-04, FP-05.

### 3.2 Task 2.2: Advanced Search API with Full-Text Search

*   **Action:** Implement full-text search endpoint using PostgreSQL `ts_vector`.
*   **Spec:** Index `name`, `description`, `flavorNotes`, `origin` fields for search.
*   **Deliverable:** `GET /api/products/search?q=...` endpoint with debouncing support.
*   **Acceptance Criteria:**
    *   **Test SF-01:** Search results return in <100ms for 100k+ simulated rows (PERF-01).
    *   **Test SF-02:** Supports partial matches ("Yirga" finds "Yirgacheffe").
    *   **Test PERF-03:** API called only once after 300ms pause during typing.

### 3.3 Task 2.3: Frontend Product Listing & Filtering UI

*   **Action:** Rebuild Product Grid to consume API instead of static JSON.
*   **Features:** 
    *   Dynamic Faceted Sidebar (filter by all 10 categories plus origin, process, roast, certifications, dietary).
    *   Skeleton loaders during fetch (UI-02).
    *   "Out of Stock" overlay logic based on `stockCount === 0` (FP-07).
    *   Multi-filter support (SF-03).
*   **Deliverable:** Responsive Product Listing Page (PLP).
*   **Acceptance Criteria:** 
    *   **Test FP-01:** Exactly 100 products displayed when no filters applied.
    *   Filtering updates URL query params (for shareability) but fetches from API.
    *   No layout shift when images load.
    *   **Test SF-04:** Zero results state displays properly.

### 3.4 Task 2.4: Product Detail Page (PDP) Enhancement

*   **Action:** Create dynamic PDP showing all 28 extended attributes.
*   **Display:** Altitude, Process Method, Tasting Notes, Farmer Story, Certifications, Sustainability Score, Traceability Data, Brewing Recommendations, Nutritional Info (where applicable).
*   **Deliverable:** `/product/:slug` route with comprehensive attribute display.
*   **Acceptance Criteria:** 
    *   **Test FP-08:** All data points visible for Bench Maji Gesha.
    *   **Test FP-09:** RTD beverage specs displayed correctly.
    *   **Test FP-10:** Byproduct specs displayed correctly.
    *   Flavor profile wheel visualization rendered.

---

## 4. Phase 3: Cart, Checkout & Order Processing (Weeks 5-6)

**Goal:** Robust transactional flow with inventory safety.

### 4.1 Task 3.1: Server-Side Cart Logic

*   **Action:** Maintain cart state in Database (`Cart` and `CartItem` tables) linked to session cookie.
*   **Logic:** Link `Cart` to `sessionId` (Guest) or `userId` (Logged-in). Merge carts on login (UR-C-03).
*   **Deliverable:** `POST /api/cart/items`, `PATCH /api/cart/items/:id`, `DELETE /api/cart/items/:id`.
*   **Acceptance Criteria:** 
    *   **Test UR-G-03:** Item appears in cart drawer; session persisted via cookie.
    *   **Test UR-C-03:** Guest items merged with account cart on login; no duplicates.
    *   Cart persists across browser close for guests (via cookie).

### 4.2 Task 3.2: Inventory Reservation & Atomic Checkout

*   **Action:** Implement atomic transactions for checkout using Prisma transactions.
*   **Logic:** 
    1.  Validate stock.
    2.  Begin Transaction.
    3.  Decrement `Product.stock` using `decrement`.
    4.  Create `Order` + `OrderItems`.
    5.  Clear Cart.
    6.  Commit.
*   **Deliverable:** `POST /api/checkout` endpoint with transaction safety.
*   **Acceptance Criteria:** 
    *   **Test SC-04:** Prevents overselling (two users buying last bag simultaneously).
    *   **Test SC-06:** Returns clear error if stock drops during process.
    *   **Test UR-OFS-04:** Stock reduced by ordered quantity after shipment.

### 4.3 Task 3.3: Order History & Status Tracking

*   **Action:** Create `GET /api/orders` (user specific) and `GET /api/orders/:id`.
*   **Deliverable:** Order History Page for customers.
*   **Acceptance Criteria:** 
    *   **Test UR-C-04:** Users see only their own orders.
    *   Status updates reflect real-time DB changes.
    *   Order confirmation includes all items, total, date (SC-07).

---

## 5. Phase 4: User Authentication & Role-Based Access Control (Weeks 7-8)

**Goal:** Secure the system and enable multi-role workflows.

### 5.1 Task 4.1: Authentication System (JWT + Refresh Tokens)

*   **Action:** Implement Registration, Login, Logout.
*   **Security:** 
    *   Passwords hashed with `bcrypt` (salt rounds 12).
    *   Access Token (15min) in memory, Refresh Token (7days) in HTTP-only Cookie.
    *   Email verification on registration (simulated).
*   **Deliverable:** `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`.
*   **Acceptance Criteria:** 
    *   **Test UR-C-01:** Account created; Welcome email sent (simulated); Auto-login.
    *   **Test UR-C-02:** Valid credentials redirect to Home; User name displayed.
    *   Invalid credentials return generic error (no user enumeration).
    *   Tokens rotate correctly.

### 5.2 Task 4.2: Role-Based Middleware

*   **Action:** Create `requireRole(...roles)` middleware.
*   **Implementation:** Check `req.user.role` against allowed roles.
*   **Deliverable:** Middleware applied to sensitive routes.
*   **Acceptance Criteria:** 
    *   **Test UR-G-06:** Guest accessing `/admin/dashboard` gets 403 or redirect.
    *   **Test SEC-05:** Customer accessing `/api/admin/products` POST gets 403 Forbidden.
    *   **Test UR-CM-xx:** Manager can access catalog dashboard.

### 5.3 Task 4.3: Content Manager Dashboard

*   **Action:** Build protected routes for Content Managers.
*   **Features:** 
    *   Product CRUD (Create, Update, Delete).
    *   Bulk Stock Update (CSV upload or table edit).
    *   Image Upload (integration with local storage / S3).
    *   All 28 product attributes editable.
*   **Deliverable:** `/manager/dashboard`, `/manager/products`, `/manager/products/new`, `/manager/products/:id/edit`.
*   **Acceptance Criteria:** 
    *   **Test UR-CM-01:** View list of 100 products with edit/delete options.
    *   **Test UR-CM-02:** Create product "Test Blend"; appears in DB and Frontend.
    *   **Test UR-CM-03:** Change stock to 0; Frontend shows "Out of Stock".
    *   **Test UR-CM-04:** Upload new image; thumbnail updated.
    *   **Test UR-CM-05:** Delete draft product; soft delete flag set.

### 5.4 Task 4.4: Order Fulfillment Portal

*   **Action:** Build interface for Order Fulfillment Staff.
*   **Features:** View "Pending" orders, Print Packing Slip, Update Status to "Shipped", Add tracking number.
*   **Deliverable:** `/fulfillment/orders`, `/fulfillment/orders/:id`.
*   **Acceptance Criteria:** 
    *   **Test UR-OFS-01:** View pending orders only.
    *   **Test UR-OFS-02:** Change status to "Shipped"; add tracking #; customer notified (simulated).
    *   **Test UR-OFS-03:** Generate PDF packing slip with items, address, QR code.

### 5.5 Task 4.5: System Administrator Dashboard

*   **Action:** Build Super Admin interface.
*   **Features:** User management, Role assignment, Audit logs view, Sales analytics.
*   **Deliverable:** `/admin/users`, `/admin/audit-logs`, `/admin/analytics`.
*   **Acceptance Criteria:** 
    *   **Test UR-SA-01:** Ban user; user cannot login.
    *   **Test UR-SA-02:** View audit log of all admin actions.
    *   **Test UR-SA-03:** View revenue graphs, top products.
    *   **Test UR-SA-04:** Assign "Content Manager" role; user gains permissions on next login.

---

## 6. Phase 5: Non-Functional Requirements & Optimization (Week 9)

**Goal:** Ensure performance, security, and reliability.

### 6.1 Task 5.1: Security Hardening (NFR-SEC-001)

*   **Actions:**
    *   Implement `helmet` for HTTP headers (CSP, X-Frame-Options, etc.).
    *   Configure `cors` to allow only specific origins.
    *   Add `express-rate-limit` to auth and search endpoints (SEC-06).
    *   Verify SQL injection protection via Prisma parameterization (SEC-03).
    *   Implement XSS prevention via output encoding (SEC-04).
*   **Acceptance Criteria:** Pass OWASP ZAP baseline scan.

### 6.2 Task 5.2: Performance Optimization

*   **Actions:**
    *   Add Redis caching for `GET /products` (TTL 5 mins).
    *   Implement Image Lazy Loading and Next-Gen formats (WebP).
    *   Database Indexing on `search_vector`, `categoryId`, `origin`, `slug`.
    *   Enable connection pooling.
*   **Acceptance Criteria:** 
    *   **Test PERF-01:** API P95 latency < 500ms under load.
    *   **Test PERF-02:** Lighthouse Performance Score > 90.
    *   **Test PERF-04:** 50 concurrent users; error rate < 1%.

### 6.3 Task 5.3: Logging & Monitoring

*   **Actions:**
    *   Integrate `winston` for structured logging.
    *   Create `AuditLog` table for Admin actions (Who changed what product?).
    *   Log all authentication attempts.
*   **Deliverable:** Log files rotated daily; Audit trail visible to Super Admin.

### 6.4 Task 5.4: Usability & Accessibility

*   **Actions:**
    *   Implement WCAG AA color contrast compliance (UI-04).
    *   Add ARIA labels to interactive elements.
    *   Keyboard navigation support.
    *   Mobile-first responsive design verification (UI-01).
*   **Acceptance Criteria:** 
    *   **Test UI-01:** Grid collapses to 1 column at 375px width.
    *   **Test UI-03:** Friendly error messages on network failures.

---

## 7. Phase 6: Testing & Deployment (Week 10)

**Goal:** Validate against Acceptance Test Plan and go live.

### 7.1 Task 6.1: Automated Integration Testing

*   **Action:** Write Jest/Supertest scripts covering critical paths.
*   **Coverage:** Login, Add to Cart, Checkout, Role Denial, Security Tests.
*   **Acceptance Criteria:** 80% Code Coverage minimum.

### 7.2 Task 6.2: User Acceptance Testing (UAT) Support

*   **Action:** Deploy to Staging Environment.
*   **Activity:** Execute the `ACCEPTANCE_TEST_PLAN.md` manually with stakeholders.
*   **Deliverable:** Sign-off on all Critical/Major test cases.
*   **Test Categories:**
    *   User Role Verification (Section 3): UR-G-xx, UR-C-xx, UR-CM-xx, UR-OFS-xx, UR-SA-xx
    *   Functional Product Tests (Section 4): FP-xx, SF-xx, SC-xx
    *   Security Tests (Section 5): SEC-01 through SEC-06
    *   Performance Tests (Section 5): PERF-01 through PERF-04
    *   Data Integrity Tests (Section 6): DATA-01 through DATA-20

### 7.3 Task 6.3: Production Deployment

*   **Action:** CI/CD Pipeline setup (GitHub Actions -> Docker -> Cloud Provider).
*   **Deliverable:** Live URL with SSL enabled.
*   **Acceptance Criteria:** Zero-downtime deployment; rollback capability.

---

## 8. Resource Requirements

| Role | Responsibility | Estimated Hours |
| :--- | :--- | :--- |
| **Backend Developer** | API, DB, Security, Auth, RBAC | 180 hrs |
| **Frontend Developer** | React UI, State Mgmt, Dashboards, Cookie Auth | 180 hrs |
| **DevOps Engineer** | DB Setup, CI/CD, Cloud Config, Redis | 50 hrs |
| **QA Engineer** | Test Planning, Execution, Automation | 100 hrs |
| **Project Manager** | Coordination, UAT Facilitation | 50 hrs |

**Total Estimated Effort:** 560 hours (~14 person-weeks)

---

## 9. Risk Management

| Risk | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Session Cookie Issues** | Medium | Critical | Rigorous cross-browser testing (Safari ITP, Chrome Incognito). Implement fallback mechanisms. |
| **Data Migration Errors** | Medium | High | Run parallel systems for 48hrs; Backup DB before migration. Test seed scripts thoroughly. |
| **Scope Creep (100 Products)** | High | Medium | Strictly adhere to schema; Defer "nice-to-have" filters to v1.1. Prioritize Critical tests. |
| **Performance Degradation** | Medium | High | Implement Redis caching early; Load test at 50% data volume. Monitor P95 latency. |
| **Security Vulnerabilities** | Low | Critical | Engage security consultant for penetration testing. Use automated security scanning (OWASP ZAP). |
| **Timeline Overrun** | Medium | Medium | Buffer time built into each phase. Weekly progress reviews. Adjust scope if needed. |

---

## 10. Acceptance Test Traceability Matrix

| Requirement | Related Test Cases | Phase | Status |
| :--- | :--- | :--- | :--- |
| **FR-PC-001** (Catalog 100 items) | FP-01, FP-02, FP-03, FP-06, DATA-01 to DATA-19 | Phase 2 | ⬜ Pending |
| **FR-PC-002** (Product Details) | FP-08, FP-09, FP-10 | Phase 2 | ⬜ Pending |
| **FR-SC-001** (Shopping Cart) | SC-01, SC-02, SC-03, SC-04, UR-G-03 | Phase 3 | ⬜ Pending |
| **FR-SC-002** (Secure Session) | UR-G-03, SC-05, SEC-01, SEC-02 | Phase 1 | ⬜ Pending |
| **FR-SF-001** (Search & Filter) | SF-01, SF-02, SF-03, SF-04, SF-05, PERF-03 | Phase 2 | ⬜ Pending |
| **FR-UA-001** (User Auth) | UR-C-01, UR-C-02, UR-C-03, UR-C-04, UR-C-05 | Phase 4 | ⬜ Pending |
| **FR-AD-001** (Admin Roles) | UR-G-06, UR-CM-01 to CM-05, UR-OFS-01 to OFS-04, UR-SA-01 to SA-04 | Phase 4 | ⬜ Pending |
| **NFR-SEC-001** (Security) | SEC-03, SEC-04, SEC-05, SEC-06 | Phase 5 | ⬜ Pending |
| **NFR-PER-001** (Performance) | PERF-01, PERF-02, PERF-04 | Phase 5 | ⬜ Pending |
| **NFR-UI-001** (Usability) | UI-01, UI-02, UI-03, UI-04 | Phase 5 | ⬜ Pending |

---

## 11. Approval

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| **Project Sponsor** | __________________ | __________________ | __________ |
| **Lead Architect** | __________________ | __________________ | __________ |
| **QA Lead** | __________________ | __________________ | __________ |
| **Development Lead** | __________________ | __________________ | __________ |

---

## Appendix A: Directory Structure Plan

```text
/specialty-coffee-platform
├── /client                 # React 18 + Vite + TypeScript
│   ├── /src
│   │   ├── /components     # Reusable UI (Buttons, Cards, Modals)
│   │   ├── /features       # Feature-based slices (Cart, Auth, Catalog, Orders)
│   │   ├── /layouts        # AdminLayout, CustomerLayout, PublicLayout
│   │   ├── /lib            # Axios/Fetch instance (credentials: 'include')
│   │   ├── /hooks          # Custom hooks (useAuth, useCart, useProducts)
│   │   ├── /pages          # Route pages (Home, ProductDetail, Dashboard)
│   │   ├── /types          # TypeScript type definitions
│   │   └── /utils          # Helper functions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── /server                 # Node.js + Express + TypeScript
│   ├── /src
│   │   ├── /config         # DB, Redis, Logger, Cookie config
│   │   ├── /controllers    # Request handlers (Auth, Product, Cart, Order, Admin)
│   │   ├── /middleware     # Auth, Role, ErrorHandler, RateLimiter
│   │   ├── /routes         # API definitions
│   │   ├── /services       # Business logic layer
│   │   ├── /utils          # Validators (Zod), Helpers, Token utils
│   │   └── server.ts
│   ├── /prisma
│   │   ├── schema.prisma   # Complete DB Schema with 100 products
│   │   ├── /migrations     # Database migrations
│   │   └── seed.ts         # 100 Product Seed Data
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml      # Local Dev (App + Postgres + Redis)
├── .env.example            # Environment variable template
├── README.md
└── UPGRADE_PLAN.md
```

---

## Appendix B: Database Schema Overview

```prisma
// Key models (simplified)

enum Role {
  GUEST
  CUSTOMER
  MANAGER
  FULFILLMENT
  ADMIN
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
  orders    Order[]
  auditLogs AuditLog[]
}

model Product {
  id                   Int      @id @default(autoincrement())
  name                 String
  description          String
  price                Decimal
  // ... 24 more attributes per FR Section 2.1.3
  category             String
  origin               String
  processMethod        String
  roastLevel           String
  grindType            String?
  flavorNotes          String?
  certifications       String?
  packagingType        String?
  weightVolume         String?
  shelfLife            String?
  storageRequirements  String?
  allergens            String?
  ingredients          String?
  nutritionalInfo      Json?
  brewingRecommendations String?
  sustainabilityScore  String?
  traceabilityData     Json?
  functionalBenefits   String?
  grade                String?
  subcategory          String?
  isExportReady        Boolean  @default(false)
  minimumOrderQty      Int      @default(1)
  stock                Int      @default(0)
  images               String   // JSON array of URLs
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  cartItems            CartItem[]
  orderItems           OrderItem[]
}

model CartItem {
  id        Int      @id @default(autoincrement())
  productId Int
  quantity  Int
  sessionId String   // From secure cookie
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())
}

model Order {
  id        Int      @id @default(autoincrement())
  userId    Int?     // Null for guest orders
  sessionId String   // For guest orders
  total     Decimal
  status    String   // pending, processing, shipped, delivered, cancelled
  trackingNumber String?
  createdAt DateTime @default(now())
  items     OrderItem[]
  user      User?    @relation(fields: [userId], references: [id])
}

model OrderItem {
  id        Int      @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Decimal  // Snapshot at time of order
  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}

model AuditLog {
  id        Int      @id @default(autoincrement())
  userId    Int
  action    String
  entity    String
  entityId  Int?
  oldValue  Json?
  newValue  Json?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## Appendix C: Immediate Next Steps (Days 1-5)

1.  **Day 1:** 
    *   Initialize Git repo with folder structure.
    *   Set up TypeScript configuration for both client and server.
    *   Install base dependencies (Express, Prisma, React, cookie-parser).

2.  **Day 2:** 
    *   Define complete `schema.prisma` with all 28 product attributes and user roles.
    *   Run first migration to create database tables.
    *   Set up PostgreSQL locally via Docker.

3.  **Day 3:** 
    *   **CRITICAL:** Implement Task 1.3 (Secure Cookies) to resolve SEC-01, SC-05.
    *   Update `server.js` with cookie-parser middleware.
    *   Update `api/client.js` to use `credentials: 'include'` instead of sessionId params.
    *   Update `CartContext.jsx` to remove localStorage session generation.

4.  **Day 4:** 
    *   Create seed script with all 100 products across 10 categories.
    *   Verify DATA-01 through DATA-19 test cases pass.

5.  **Day 5:** 
    *   Implement base Product API with filtering.
    *   Connect frontend ProductGrid to API.
    *   Verify FP-01 (100 products display).

---

## Appendix D: API Endpoint Specification

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns tokens, sets refresh cookie)
- `POST /api/auth/logout` - Logout (clears refresh cookie)
- `POST /api/auth/refresh` - Refresh access token

### Products
- `GET /api/products` - List products with filters (search, category, origin, process, roast, etc.)
- `GET /api/products/:id` - Get single product
- `GET /api/products/search?q=` - Full-text search
- `GET /api/categories` - List all categories
- `GET /api/origins` - List all origins

### Cart (Session-based via cookie)
- `GET /api/cart` - Get current cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:id` - Update item quantity
- `DELETE /api/cart/items/:id` - Remove item
- `POST /api/cart/clear` - Clear cart

### Orders
- `POST /api/checkout` - Process checkout (atomic transaction)
- `GET /api/orders` - Get user's orders (authenticated)
- `GET /api/orders/:id` - Get single order details

### Admin (Requires MANAGER or ADMIN role)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/bulk-stock` - Bulk stock update

### Fulfillment (Requires FULFILLMENT or ADMIN role)
- `GET /api/fulfillment/orders` - List orders by status
- `PATCH /api/fulfillment/orders/:id/status` - Update order status
- `GET /api/fulfillment/orders/:id/packing-slip` - Generate packing slip

### Admin (Requires ADMIN role)
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `PATCH /api/admin/users/:id/status` - Ban/activate user
- `GET /api/admin/audit-logs` - View audit trail
- `GET /api/admin/analytics` - Sales analytics

---

**Document End**
