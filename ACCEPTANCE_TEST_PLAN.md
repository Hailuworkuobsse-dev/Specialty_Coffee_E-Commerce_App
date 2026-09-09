# Acceptance Test Plan (ATP)
## Specialty Coffee Shop E-Commerce Platform
### Version 1.1 | Date: September 8, 2026

---

## 1. Introduction

### 1.1 Purpose
This document defines the Acceptance Test Plan (ATP) for the Specialty Coffee Shop E-Commerce Platform. It outlines the strategy, scope, resources, and detailed test cases required to verify that the system meets the Functional and Non-Functional Requirements specified in `FUNCTIONAL_REQUIREMENTS.md`.

### 1.2 Scope
This plan covers:
- **User Roles**: Guest, Registered Customer, Content Manager, Order Fulfillment Staff, System Administrator.
- **Functional Areas**: Product Catalog (100 items), Search & Filtering, Shopping Cart, Checkout, User Authentication, Admin Dashboard, Order Management.
- **Non-Functional Areas**: Security (Session Management), Performance, Usability, Compatibility.
- **Data Integrity**: Verification of the 100-product portfolio across 10 categories.

### 1.3 References
- Functional Requirements Specification (`FUNCTIONAL_REQUIREMENTS.md`)
- System Architecture Diagram
- API Documentation

### 1.4 Definitions
- **Pass**: Actual result matches expected result; no defects found.
- **Fail**: Actual result differs from expected; defect logged.
- **Blocked**: Test cannot be executed due to environmental issues or dependency failure.
- **N/A**: Test case not applicable to current build scope.

---

## 2. Test Strategy

### 2.1 Testing Levels
1.  **System Integration Testing (SIT)**: Verifies interaction between React Frontend, Node.js Backend, and MySQL Database.
2.  **User Acceptance Testing (UAT)**: Performed by stakeholders to ensure business requirements (e.g., specific coffee attributes) are met.
3.  **Security Testing**: Focused on session hijacking prevention, input validation, and RBAC.
4.  **Performance Testing**: Load testing for search debouncing and API response times (<500ms).

### 2.2 Test Environment
| Component | Specification |
| :--- | :--- |
| **Frontend** | React 18.x, Tailwind CSS 3.x, Vite |
| **Backend** | Node.js 18+, Express 4.x |
| **Database** | MySQL 8.0 (via Prisma ORM) |
| **Browser** | Chrome (Latest), Firefox (Latest), Safari (Latest) |
| **Network** | Throttled (Fast 3G) and Broadband |

### 2.3 Entry & Exit Criteria
- **Entry**: Code merged to `staging` branch, database seeded with 100 products, environment deployed.
- **Exit**: 100% of Critical/High priority tests passed, zero open Critical/High defects, performance benchmarks met.

---

## 3. User Role Verification Tests

### 3.1 Guest User
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UR-G-01** | Browse Catalog | None | Navigate to Home Page. | Display product grid with pagination. | High |
| **UR-G-02** | View Product Details | None | Click on "Yirgacheffe Washed Grade 1". | Show detailed modal/page with origin, notes, price. | High |
| **UR-G-03** | Add to Cart (Session) | None | Click "Add to Cart" on an item. | Item appears in cart drawer; `X-Session-Id` generated in `sessionStorage`. | Critical |
| **UR-G-04** | Persist Cart (Refresh) | Item in cart | Refresh browser page. | Cart items remain visible; Session ID persists. | High |
| **UR-G-05** | Checkout as Guest | Items in cart | Proceed to Checkout. | Prompt to "Continue as Guest" or "Login". Simulated success. | High |
| **UR-G-06** | Access Admin URL | None | Navigate to `/admin/dashboard`. | Redirect to Login or 403 Forbidden. | Critical |

### 3.2 Registered Customer
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UR-C-01** | Register Account | None | Fill registration form (valid data). | Account created; Welcome email sent (simulated); Auto-login. | High |
| **UR-C-02** | Login | Account exists | Enter valid credentials. | Redirect to Home; User name displayed in header. | High |
| **UR-C-03** | Persistent Cart Merge | Cart has guest items | Login with account having existing saved cart. | Guest items merged with account cart; no duplicates. | Medium |
| **UR-C-04** | View Order History | Past orders exist | Navigate to "My Orders". | List of past orders with status and details. | High |
| **UR-C-05** | Update Profile | Logged in | Change address/password. | Changes saved; Confirmation message displayed. | Medium |

### 3.3 Content Manager (Catalog Admin)
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UR-CM-01** | Access Catalog Dashboard | Logged in as CM | Navigate to `/admin/products`. | View list of 100 products with edit/delete options. | High |
| **UR-CM-02** | Add New Product | Logged in as CM | Create product "Test Blend"; Save. | Product appears in DB and Frontend immediately. | High |
| **UR-CM-03** | Update Stock Level | Product exists | Change stock of "Harar Longberry" to 0. | Frontend shows "Out of Stock"; Add to Cart disabled. | Critical |
| **UR-CM-04** | Upload Image | Product edit mode | Upload new bean image. | Image saved to storage; Thumbnail updated in grid. | Medium |
| **UR-CM-05** | Delete Product | Product exists | Delete a draft product. | Product removed from DB; Soft delete flag set. | Medium |

### 3.4 Order Fulfillment Staff
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UR-OFS-01** | View Pending Orders | Order placed | Navigate to `/admin/orders?status=pending`. | List new orders only. | High |
| **UR-OFS-02** | Update Order Status | Order selected | Change status to "Shipped"; Add tracking #. | Status updated; Customer notified (simulated). | High |
| **UR-OFS-03** | Print Packing Slip | Order selected | Click "Print Packing Slip". | Generate PDF with items, shipping address, QR code. | Medium |
| **UR-OFS-04** | Inventory Deduction | Order shipped | Verify DB stock count. | Stock reduced by ordered quantity. | Critical |

### 3.5 System Administrator
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UR-SA-01** | Manage Users | Logged in as SA | View user list; Ban a user. | User cannot login; Status updated to "Banned". | High |
| **UR-SA-02** | View System Logs | Activity exists | Navigate to Audit Logs. | See log of all admin actions (who, what, when). | Medium |
| **UR-SA-03** | Sales Analytics | Orders exist | View Dashboard Charts. | Graphs show revenue, top products (e.g., "Guji Natural"). | Medium |
| **UR-SA-04** | Role Assignment | User selected | Assign "Content Manager" role to user. | User gains CM permissions immediately upon next login. | High |

---

## 4. Functional Test Cases: Product Portfolio

*Validating the 100-product catalog across 10 categories.*

### 4.1 Catalog Display & Attributes
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FP-01** | Verify Total Count | DB Seeded | Count products in Grid (all pages). | Exactly 100 products displayed. | Critical |
| **FP-02** | Category Filtering | None | Filter by "Coffee Chocolates & Dragees". | Display only items 36-47. Count = 12. | High |
| **FP-03** | Origin Filtering | None | Filter by Origin "Yirgacheffe". | Display items: 1, 2, 23, 28, 38, 67, etc. | High |
| **FP-04** | Process Filtering | None | Filter by Process "Anaerobic Fermented". | Display item 19 only. | Medium |
| **FP-05** | Certification Filtering | None | Filter by "USDA Organic". | Display item 23 and others with tag. | Medium |
| **FP-06** | Price Range Sort | None | Sort by Price: Low to High. | First item is lowest price (e.g., Jimma Grade 5). | High |
| **FP-07** | Out of Stock Visual | Stock=0 | View product card for out-of-stock item. | "Out of Stock" badge; Button disabled/greyed. | High |
| **FP-08** | Product Detail Accuracy | Item 14 (Gesha) | Open details for "Bench Maji Gesha". | Verify Price, Altitude, Tasting Notes (Floral/Peach). | High |
| **FP-09** | RTD Beverage Specs | Item 60 (Nitro) | Open details for "Nitro Cold Brew". | Verify "Nitrogen-Infused", "Widget Can" description. | Medium |
| **FP-10** | Byproduct Specs | Item 77 (Cascara) | Open details for "Cascara Tea". | Verify "Sun-Dried", "Husk" description. | Medium |

### 4.2 Search & Filtering Logic
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SF-01** | Keyword Search (Name) | None | Type "Harar" in search bar. | Results update after 300ms debounce; Show Harar items. | High |
| **SF-02** | Keyword Search (Notes) | None | Type "Blueberry" in search bar. | Show items with blueberry notes (e.g., Harar Natural, Guji Natural). | Medium |
| **SF-03** | Multi-Filter | None | Select "Dark Roast" AND "Espresso Grind". | Intersection of both filters displayed. | High |
| **SF-04** | Zero Results State | None | Search "NonExistentProductXYZ". | Display "No products found" message with clear filter option. | Medium |
| **SF-05** | Special Characters | None | Search "Café" or "José". | System handles UTF-8; No errors. | Low |

### 4.3 Shopping Cart & Checkout
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SC-01** | Add Multiple Items | None | Add 3 different products. | Cart count = 3; Subtotal calculated correctly. | High |
| **SC-02** | Update Quantity | Item in cart | Change qty from 1 to 5. | Total price updates instantly. | High |
| **SC-03** | Remove Item | Item in cart | Click "Remove". | Item deleted; Cart recalculates. | High |
| **SC-04** | Max Stock Validation | Stock=10 | Try to add 11 items. | Error: "Only 10 available"; Cart caps at 10. | Critical |
| **SC-05** | Session Header Check | Any Request | Inspect Network Tab (DevTools). | Request Header `X-Session-Id` present; **NO** query param `?sessionId=`. | **Critical** |
| **SC-06** | Checkout Simulation | Cart > $0 | Complete checkout flow. | Success page; Order ID generated; Cart cleared. | High |
| **SC-07** | Email Receipt | Checkout done | Check simulated email log. | Receipt contains correct items, total, date. | Medium |

---

## 5. Security & Non-Functional Tests

### 5.1 Security (Critical Focus)
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | No Session in URL | Cart Access | Navigate to cart; Copy URL. | URL must **NOT** contain `?sessionId=` or similar. | **Critical** |
| **SEC-02** | Header Injection | Valid Session | Modify `X-Session-Id` to invalid UUID. | API returns 401/404; No data leaked. | Critical |
| **SEC-03** | SQL Injection | Search Bar | Input `' OR 1=1 --` in search. | Returns no results or safe error; DB not compromised. | Critical |
| **SEC-04** | XSS Prevention | Profile Name | Input `<script>alert('x')</script>` in name. | Script tags escaped/displayed as text; Not executed. | Critical |
| **SEC-05** | RBAC Enforcement | Customer Login | Try to POST to `/api/admin/products`. | 403 Forbidden. | Critical |
| **SEC-06** | Rate Limiting | API Client | Send 100 requests/sec to login endpoint. | IP blocked or 429 Too Many Requests after threshold. | High |

### 5.2 Performance
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PERF-01** | API Response Time | Normal Load | Measure `GET /api/products`. | Avg response < 500ms. | High |
| **PERF-02** | Page Load Time | Fresh Cache | Load Home Page on 3G. | Fully Interactive < 3.0s. | Medium |
| **PERF-03** | Search Debounce | Typing | Type 10 chars rapidly. | API called only once (after 300ms pause), not 10 times. | High |
| **PERF-04** | Concurrent Users | Load Test | Simulate 50 users browsing/adding to cart. | No server crashes; Error rate < 1%. | Medium |

### 5.3 Usability & UI
| ID | Test Case | Pre-conditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UI-01** | Mobile Responsiveness | Mobile View | Resize browser to 375px width. | Grid collapses to 1 column; Menu becomes hamburger. | High |
| **UI-02** | Loading States | Slow Network | Throttle to "Slow 3G"; Load products. | Skeleton loaders visible before data arrives. | Medium |
| **UI-03** | Error Messaging | Network Fail | Disconnect internet; Add to cart. | Friendly error: "Connection lost. Please retry." | Medium |
| **UI-04** | Color Contrast | Design Review | Check text vs background colors. | Meets WCAG AA standards. | Low |

---

## 6. Data Integrity Tests (The 100 Products)

*Spot checks to ensure the specific portfolio data is accurate.*

| ID | Category | Product Name | Attribute to Verify | Expected Value |
| :--- | :--- | :--- | :--- | :--- |
| **DATA-01** | Green Beans | Yirgacheffe Washed Grade 1 | Tasting Notes | "Floral jasmine", "Crisp citrus" |
| **DATA-02** | Green Beans | Harar Longberry Natural Grade 1 | Profile | "Intense blueberry", "Dark mocha" |
| **DATA-03** | Fermentation | Anaerobic Fermented Guji | Process Time | "72+ hours" |
| **DATA-04** | Fermentation | Carbonic Maceration Yirgacheffe | Flavor Profile | "Intense banana" |
| **DATA-05** | Roasted | Turkish-Fine Ground Cardamom | Grind Size | "Extremely fine powder" |
| **DATA-06** | Chocolate | Dark Chocolate-Covered Roasted Guji | Cocoa % | "70%" |
| **DATA-07** | Chocolate | Vegan Oat-Milk Coffee Chocolate | Dairy Status | "Dairy-free" |
| **DATA-08** | Dairy/Plant | Ultra-Filtered High-Protein Coffee Milk | Protein Content | "20g" |
| **DATA-09** | RTD | Nitro Cold Brew | Packaging | "Nitrogen-Infused Can with widget" |
| **DATA-10** | RTD | Compostable PLA Espresso Pods | Material | "Plant-derived eco-friendly" |
| **DATA-11** | Solubles | Freeze-Dried Premium Instant | Method | "Sub-zero vacuum dehydrated" |
| **DATA-12** | Bakery | Coffee-Floured Dry Baking Mix | Ingredient | "Coffee cherry pulp" |
| **DATA-13** | Byproducts | Sun-Dried Cascara Tea | Part Used | "Outer husks" |
| **DATA-14** | Byproducts | Cold-Pressed Green Coffee Seed Oil | Use Case | "Anti-aging skin serums" |
| **DATA-15** | Functional | Lion's Mane Mushroom Enhanced | Benefit | "Cognitive focus" |
| **DATA-16** | Functional | CBD-Infused Medium Roast | Additive | "Hemp-derived cannabidiol" |
| **DATA-17** | Functional | Bourbon Barrel-Aged Raw Coffee | Aging Vessel | "Charred oak bourbon barrels" |
| **DATA-18** | Single Origin | Ultra-Traceable Single-Farm Micro-Lot | Traceability | "GPS coordinates", "Grower portrait" |
| **DATA-19** | Count | All Categories | Total Items | 100 |
| **DATA-20** | Images | Random Sample (10 items) | Image Presence | All have valid image URLs |

---

## 7. Traceability Matrix (Summary)

| Requirement ID | Test Case IDs | Status |
| :--- | :--- | :--- |
| **FR-PC-001** (Catalog) | FP-01, FP-02, FP-03, FP-06, DATA-xx | ⬜ Pending |
| **FR-PC-002** (Details) | FP-08, FP-09, FP-10 | ⬜ Pending |
| **FR-SC-001** (Cart) | SC-01, SC-02, SC-03, SC-04 | ⬜ Pending |
| **FR-SC-002** (Session) | UR-G-03, SC-05, SEC-01, SEC-02 | ⬜ Pending |
| **FR-SF-001** (Search) | SF-01, SF-02, SF-03, PERF-03 | ⬜ Pending |
| **FR-UA-001** (Auth) | UR-C-01, UR-C-02, SEC-05 | ⬜ Pending |
| **FR-AD-001** (Admin) | UR-CM-xx, UR-OFS-xx, UR-SA-xx | ⬜ Pending |
| **NFR-SEC-001** (Security) | SEC-03, SEC-04, SEC-06 | ⬜ Pending |
| **NFR-PER-001** (Perf) | PERF-01, PERF-02, PERF-04 | ⬜ Pending |

---

## 8. Defect Reporting Template

If a test fails, log the issue using the following format:

```markdown
**Defect ID**: [Auto-generated]
**Title**: [Short description]
**Severity**: Critical / High / Medium / Low
**Test Case ID**: [e.g., SC-05]
**Environment**: [Browser, OS, Device]
**Pre-conditions**: [What was set up]
**Steps to Reproduce**:
1. ...
2. ...
**Expected Result**: ...
**Actual Result**: ...
**Evidence**: [Screenshot/Log snippet]
```

---

## 9. Sign-off

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| **QA Lead** | __________________ | __________________ | __________ |
| **Project Manager** | __________________ | __________________ | __________ |
| **Product Owner** | __________________ | __________________ | __________ |
| **Client Representative** | __________________ | __________________ | __________ |

---

*End of Acceptance Test Plan*
