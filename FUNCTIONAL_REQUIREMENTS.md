# Functional System Requirements Specification (SRS)
## Specialty Coffee Shop E-Commerce Platform

**Version:** 1.0  
**Date:** September 8, 2026  
**Status:** Draft  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features and Requirements](#3-system-features-and-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Appendix](#6-appendix)

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional system requirements for the **Specialty Coffee Shop E-Commerce Platform**, a full-stack web application that enables customers to browse, search, and purchase premium specialty coffee products online. The system provides a complete e-commerce experience including product catalog management, shopping cart functionality, and order processing.

### 1.2 Scope

The Specialty Coffee Shop is a production-ready e-commerce web application with the following key capabilities:

- **Product Catalog**: Display six premium specialty coffee products with detailed information
- **Search & Filtering**: Enable customers to search products by name and filter by category
- **Shopping Cart**: Session-based cart management with real-time updates
- **Checkout Process**: Simulated order processing with inventory management
- **Responsive UI**: Mobile-first design with warm, coffee-inspired aesthetics

The system consists of two main components:
1. **Backend API** (Node.js/Express + Prisma + MySQL)
2. **Frontend Application** (React.js + Vite + Tailwind CSS)

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **ORM** | Object-Relational Mapping |
| **CORS** | Cross-Origin Resource Sharing |
| **SRS** | System Requirements Specification |
| **UI** | User Interface |
| **UX** | User Experience |
| **REST** | Representational State Transfer |
| **Session ID** | Unique identifier for user session storage |

### 1.4 References

- Project README: `./README.md`
- Database Schema: `backend/prisma/schema.prisma`
- Backend Server: `backend/src/server.js`
- Frontend Application: `frontend/src/App.jsx`

### 1.5 Overview

Section 2 provides an overall description of the system including its perspective, functions, user characteristics, and constraints. Section 3 details specific functional requirements organized by feature. Section 4 describes external interface requirements. Section 5 outlines non-functional requirements such as performance and security. Section 6 contains supplementary information.

---

## 2. Overall Description

### 2.1 Product Perspective

The Specialty Coffee Shop is a standalone e-commerce platform designed for small to medium-sized specialty coffee retailers. The system operates as a client-server architecture with:

- **Frontend Client**: Single-page React application running in the user's browser
- **Backend Server**: RESTful API server handling business logic and data persistence
- **Database**: MySQL relational database storing products, cart items, and orders

```
┌─────────────────┐      HTTP/HTTPS      ┌─────────────────┐      SQL      ┌──────────────┐
│                 │ ◄──────────────────► │                 │ ◄──────────► │              │
│   React SPA     │                      │  Express API    │              │    MySQL     │
│   (Frontend)    │                      │    (Backend)    │              │   Database   │
│                 │                      │                 │              │              │
└─────────────────┘                      └─────────────────┘              └──────────────┘
     Port 5173                               Port 5000                        Port 3306
```

### 2.1.3 Product Portfolio & Categories

The platform supports a comprehensive portfolio of 100+ distinct coffee-based products organized into the following categories:

#### Category 1: Raw & Specialty Green Coffee Beans (Products 1-18)
- **Regional Specialties**: Yirgacheffe, Sidamo, Harar, Guji, Limu, Jimma, Nekemte, Kaffa, Bench Maji, Teppi, Bebeka, Bale Mountain, Zege
- **Grading**: Grade 1-5 classifications (Washed and Natural processing)
- **Profile Notes**: Floral jasmine, citrus acidity, strawberry, blueberry, lemon-bergamot, dark mocha, tropical peach, raspberry jam, milk chocolate, winey finishes
- **Special Varietals**: Gesha varietal, Forest coffee, Wild arabica, Heirloom crops

#### Category 2: Specialized Fermentations & Sustainable Lots (Products 19-29)
- **Processing Methods**: Anaerobic fermentation, Carbonic maceration, Honey-process, Yeast-inoculated fermentation
- **Certifications**: USDA Organic, Fairtrade, Rainforest Alliance
- **Decaffeination**: Swiss Water Process, CO2 Decaf (chemical-free)
- **Flavor Profiles**: Cinnamon, banana, honeyed sweetness, tropical fruit esters

#### Category 3: Roasted Whole Beans & Ground Retail Coffee (Products 28-35)
- **Roast Levels**: Cinnamon Light, Medium City, Dark Full-City Espresso
- **Grind Types**: Turkish-fine, Espresso-grind, Drip-grind, French Press coarse, Pour-over drip bags
- **Packaging**: Vacuum packs, Nitrogen-flushed valve bags, Single-serve hanging filters
- **Blends**: Regional blends (Sidamo + Limu), Single-origin roasts

#### Category 4: Coffee Chocolates & Dragees (Products 36-47)
- **Chocolate Types**: Dark (70%, 85%), Milk, White, Ruby, Blonde (caramelized)
- **Formats**: Chocolate-covered beans, Dragees, Truffles, Bars, Bark, Squares, Mints
- **Flavor Combinations**: Espresso-infused, Mocha cream, Coffee-caramel, Macchiato, Cappuccino crunch
- **Dietary Options**: Vegan oat-milk chocolate bars
- **Additions**: Almonds, mint, berry-mocha, crushed coffee nibs

#### Category 5: Coffee + Dairy & Plant-Milk Formulations (Products 48-58)
- **Dairy Options**: Whole milk latte, High-protein coffee milk, Coffee-butter spread
- **Plant Milks**: Oat milk, Almond milk, Coconut milk, Soy milk
- **Formats**: Canned RTD, Bottled, Liquid creamer, Squeeze tubes, Powdered instant mixes
- **Flavors**: Espresso latte, Cold brew, Macchiato, Mocha, Vanilla cappuccino
- **Special Features**: Ultra-filtered, Shelf-stable, Nitrogen-flushed, All-in-one soluble powder

#### Category 6: Ready-to-Drink (RTD) Beverages & Pods (Products 59-65)
- **Beverage Types**: Still cold brew, Nitro cold brew, Sparkling coffee-tonic
- **Pod Systems**: Nespresso-compatible aluminum capsules, Compostable PLA pods, Keurig K-Cups
- **Packaging**: Canned with widget technology, Bag-in-box multi-serve concentrate
- **Features**: Zero-sugar, Nitrogen-infused creamy head, Botanical tonic water blend

#### Category 7: Solubles, Powders & Syrups (Products 66-71)
- **Instant Coffee**: Spray-dried economic powder, Freeze-dried premium crystals, Micro-ground roasted arabica
- **Syrups & Sauces**: Artisanal simple syrup, Sugar-free mocha dessert sauce
- **Blends**: Instant chicory-coffee retail blend
- **Applications**: Cocktail bartenders, Coffee shops, Home brewing, Bulk retail

#### Category 8: Coffee Bakery, Bakery Ingredients & Pastries (Products 72-76)
- **Confections**: Espresso-glazed roasted beans
- **Baking Ingredients**: Coffee-floured dry mix (gluten-free, upcycled cascara), Professional espresso paste, Ready-to-use mocha frosting
- **Finished Products**: Coffee-infused biscotti with hazelnuts
- **Targets**: Professional bakers, Commercial baking tubs, Retail cookie packs

#### Category 9: Agriculture Byproducts & Novelty Innovations (Products 77-84)
- **Cascara Products**: Sun-dried cascara tea, Fine-milled cascara powder (superfood)
- **Specialty Foods**: Monofloral coffee blossom honey
- **Wellness Extracts**: Raw green coffee bean wellness extract (chlorogenic acids)
- **Cosmetics**: Coffee ground body scrub, Cold-pressed green coffee seed oil (anti-aging)
- **Beverages**: Coffee leaf herbal tea sachets (low-caffeine, high-antioxidant)
- **Sustainability**: Compressed coffee ground fuel pellets (upcycled biomass)

#### Category 10: Functional, Enhanced & Gourmet Blends (Products 85-100)
- **Mushroom Enhancements**: Lion's Mane (cognitive focus), Cordyceps (energy performance)
- **Health Additions**: Collagen peptides, CBD isolate, Ashwagandha adaptogen, Probiotic spores, Maca root, Vitamin B-complex
- **Gourmet Infusions**: Bourbon barrel-aged, Irish whiskey infused, Vanilla bean infused, Hazelnut flavored, Holiday spice pumpkin blend
- **Performance Blends**: High-caffeine enhanced (green tea extract), Keto coffee powder (MCT oil + grass-fed butter)
- **Traceability**: Ultra-traceable single-farm micro-lots with GPS coordinates and grower portraits

### Product Attributes System

Each product in the catalog must support the following attributes:

| Attribute | Description | Example Values |
|-----------|-------------|----------------|
| `productID` | Unique identifier | `COF-YRG-WASH-G1-001` |
| `name` | Product display name | `Yirgacheffe Washed Grade 1` |
| `category` | Primary category | `Green Coffee Beans`, `Coffee Chocolates`, `RTD Beverages` |
| `subcategory` | Secondary classification | `Washed`, `Dark Chocolate`, `Canned` |
| `origin` | Geographic origin | `Yirgacheffe`, `Sidamo`, `Harar`, `Guji` |
| `grade` | Quality grading | `Grade 1`, `Grade 2`, `Specialty`, `Commercial` |
| `processMethod` | Processing technique | `Washed`, `Natural`, `Honey`, `Anaerobic`, `Carbonic Maceration` |
| `roastLevel` | Roast classification | `Light`, `Medium`, `Dark`, `Espresso`, `Turkish` |
| `grindType` | Grind specification | `Whole Bean`, `Espresso`, `Drip`, `French Press`, `Turkish Fine` |
| `flavorNotes` | Tasting profile descriptors | `Floral Jasmine`, `Blueberry`, `Citrus Acidity`, `Dark Mocha`, `Tropical Peach` |
| `certifications` | Quality/ethical certifications | `USDA Organic`, `Fairtrade`, `Rainforest Alliance`, `Specialty Grade` |
| `packagingType` | Container format | `Vacuum Bag`, `Nitrogen-Flushed Valve Bag`, `Can`, `Bottle`, `Pod`, `Box` |
| `weightVolume` | Net quantity | `250g`, `500g`, `1kg`, `330ml`, `12-pack` |
| `priceUSD` | Base price in US dollars | `24.99`, `89.99`, `156.00` |
| `stockQuantity` | Available inventory units | `0-10000+` |
| `isExportReady` | Export compliance status | `true/false` |
| `minimumOrderQty` | B2B minimum order requirement | `1`, `10`, `50`, `100` (units) |
| `shelfLife` | Product longevity | `12 months`, `18 months`, `24 months` |
| `storageRequirements` | Handling instructions | `Cool Dry Place`, `Refrigerated`, `Freezer`, `Ambient` |
| `allergens` | Allergen warnings | `Contains Milk`, `Contains Nuts`, `Vegan`, `Gluten-Free` |
| `ingredients` | Full ingredient list | `100% Arabica Coffee`, `Coffee, Milk, Sugar`, `Coffee, Oat Powder` |
| `nutritionalInfo` | Nutritional data (per serving) | `Calories, Protein, Carbs, Fat` |
| `brewingRecommendations` | Preparation guidelines | `Espresso 18g/36ml`, `French Press 4min`, `Cold Brew 12hrs` |
| `sustainabilityScore` | Environmental impact rating | `A+`, `A`, `B`, `C` |
| `traceabilityData` | Supply chain transparency | `Farm GPS Coordinates`, `Grower Name`, `Harvest Date` |
| `functionalBenefits` | Health/wellness claims | `Cognitive Focus`, `Energy Boost`, `Gut Health`, `Stress Relief` |
| `createdAt` | Product creation timestamp | ISO 8601 datetime |
| `updatedAt` | Last modification timestamp | ISO 8601 datetime |

### Product Search & Filter Capabilities

The system shall enable users to filter products by:
- **Category** (10 main categories)
- **Origin Region** (Yirgacheffe, Sidamo, Harar, Guji, etc.)
- **Processing Method** (Washed, Natural, Honey, Anaerobic, etc.)
- **Roast Level** (Light, Medium, Dark)
- **Grind Type** (Whole Bean, Espresso, Drip, etc.)
- **Certification** (Organic, Fairtrade, Rainforest Alliance)
- **Flavor Profile** (Floral, Fruity, Chocolatey, Nutty, Spicy)
- **Price Range** ($0-$50, $50-$100, $100+)
- **Dietary Requirements** (Vegan, Gluten-Free, Dairy-Free, Keto)
- **Functional Benefits** (Energy, Focus, Relaxation, Gut Health)
- **Packaging Type** (Bag, Can, Bottle, Pod, Box)
- **Export Compliance** (Export-ready products only)
- **Stock Availability** (In-stock, Pre-order, Out-of-stock)

### Product Display Requirements

Each product detail page must display:
1. High-resolution product images (multiple angles for packaged goods)
2. Comprehensive product description with origin story
3. Detailed flavor profile wheel visualization
4. Brewing/preparation recommendations
5. Nutritional information table (for consumable RTD/confectionery products)
6. Certification badges (Organic, Fairtrade, etc.)
7. Sustainability score and traceability map
8. Customer reviews and ratings (future enhancement)
9. Related products from same origin/category
10. Bulk pricing tiers for B2B customers (future enhancement)

### 2.2 Product Functions

The system provides the following major functions:

1. **Product Management**
   - Display all available coffee products across 10 categories (100+ products)
   - Show detailed product information (name, description, price, image, category, origin, grade, process method, flavor notes, certifications, stock)
   - Support product search by keyword, origin, flavor profile, and functional benefits
   - Filter products by category, origin region, processing method, roast level, grind type, certification, dietary requirements, and price range

2. **Shopping Cart**
   - Add products to cart with specified quantity
   - Update cart item quantities
   - Remove items from cart
   - Persist cart data per session (guest) or user account (registered)
   - Calculate cart totals (subtotal, tax, shipping)
   - Support B2B minimum order quantities for wholesale products

3. **Order Processing**
   - Validate cart items against current stock
   - Process checkout transactions
   - Create order records with full product details and customer information
   - Update inventory levels
   - Generate order confirmation
   - Support export documentation for international orders (future enhancement)

4. **User Interface**
   - Responsive product grid layout optimized for large catalogs
   - Interactive product modals with comprehensive attribute display
   - Slide-out cart sidebar
   - Advanced search and multi-filter controls
   - Checkout success feedback
   - Flavor profile visualization wheels
   - Certification badges and sustainability score displays
   - Traceability maps showing farm origins

5. **User Management** (Registered users and Admin roles only)
   - User registration and authentication
   - Profile management
   - Order history viewing
   - Address book management
   - Role-based dashboard access (Content Manager, Order Staff, System Admin)

### 2.3 User Characteristics

#### 2.3.1 User Roles

The system supports five distinct user roles with varying levels of access and permissions:

| Role | Description | Authentication Required |
|------|-------------|------------------------|
| **Guest User** | Unauthenticated visitor who can browse products, search/filter, view details, and add items to a temporary session-based cart | No |
| **Registered Customer** | Authenticated user with persistent account, profile management, order history, saved addresses, and persistent cart across sessions | Yes |
| **Content Manager / Catalog Administrator** | Manages product catalog including adding, editing, deleting products, updating stock levels, managing categories and product images | Yes |
| **Order Fulfillment Staff** | Processes customer orders, updates order status (pending → confirmed → shipped → delivered), manages inventory deduction, handles returns | Yes |
| **System Administrator (Super Admin)** | Full system access including user account management, role assignments, system configuration, sales analytics, audit logs, and database maintenance | Yes |

#### 2.3.2 Role Permissions Matrix

| Feature/Function | Guest | Registered Customer | Content Manager | Order Staff | System Admin |
|-----------------|-------|---------------------|-----------------|-------------|--------------|
| Browse Products | ✓ | ✓ | ✓ | ✓ | ✓ |
| Search & Filter | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Product Details | ✓ | ✓ | ✓ | ✓ | ✓ |
| Add to Cart | ✓ (session) | ✓ (persistent) | ✓ | ✓ | ✓ |
| Checkout | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Order History | ✗ | ✓ (own orders) | ✗ | ✓ (all orders) | ✓ (all orders) |
| Manage Profile | ✗ | ✓ | ✓ | ✓ | ✓ |
| Save Addresses | ✗ | ✓ | ✗ | ✗ | ✗ |
| Add/Edit Products | ✗ | ✗ | ✓ | ✗ | ✓ |
| Delete Products | ✗ | ✗ | ✓ | ✗ | ✓ |
| Manage Stock Levels | ✗ | ✗ | ✓ | ✓ | ✓ |
| Process Orders | ✗ | ✗ | ✗ | ✓ | ✓ |
| Update Order Status | ✗ | ✗ | ✗ | ✓ | ✓ |
| View Sales Analytics | ✗ | ✗ | ✗ | ✗ | ✓ |
| Manage Users | ✗ | ✗ | ✗ | ✗ | ✓ |
| Assign Roles | ✗ | ✗ | ✗ | ✗ | ✓ |
| View Audit Logs | ✗ | ✗ | ✗ | ✗ | ✓ |
| System Configuration | ✗ | ✗ | ✗ | ✗ | ✓ |

#### 2.3.3 User Role Characteristics

**Guest User:**
- Technical Proficiency: Basic web browsing skills
- Primary Goals: Quick product discovery, fast checkout without registration
- Expectations: Intuitive navigation, clear pricing, no forced registration
- Session Duration: Browser session only (cart lost on browser close)

**Registered Customer:**
- Technical Proficiency: Basic to intermediate web skills
- Primary Goals: Easy reordering, order tracking, saved preferences
- Expectations: Secure account, order history, personalized experience
- Session Duration: Persistent across browser sessions (remember me option)

**Content Manager / Catalog Administrator:**
- Technical Proficiency: Intermediate technical knowledge, familiar with CMS interfaces
- Primary Goals: Efficient product management, accurate inventory tracking
- Expectations: Bulk edit capabilities, image upload tools, stock alerts
- Access Method: Dedicated admin dashboard

**Order Fulfillment Staff:**
- Technical Proficiency: Intermediate operational knowledge
- Primary Goals: Fast order processing, accurate status updates, inventory sync
- Expectations: Clear order queue, batch processing, shipping integration
- Access Method: Operations dashboard with order management tools

**System Administrator:**
- Technical Proficiency: Advanced technical expertise
- Primary Goals: System health, security compliance, performance optimization
- Expectations: Comprehensive analytics, user management, audit trails
- Access Method: Full admin panel with system-wide controls

### 2.4 Constraints

#### Technical Constraints
- **Backend Runtime**: Node.js v18 or higher
- **Database**: MySQL v8.0+
- **Frontend Build**: Vite bundler
- **Styling Framework**: Tailwind CSS
- **ORM**: Prisma for database access

#### Operational Constraints
- Requires active internet connection
- Session-based cart (no user authentication in current version)
- Simulated payment processing (no real payment gateway integration)

#### Business Constraints
- Initial product catalog limited to 6 specialty coffee items
- Single currency support (USD)
- Domestic shipping only (simulated)

### 2.5 Assumptions and Dependencies

#### Assumptions
1. Users have modern web browsers with JavaScript enabled
2. MySQL database server is properly configured and accessible
3. Backend and frontend servers run on specified ports (5000, 5173)
4. Session IDs are generated client-side as UUID v4 on first visit and stored in `sessionStorage`. This ID shall be sent in the `X-Session-Id` custom HTTP header for all cart-related API requests. The session persists for the browsing session (cleared when browser/tab is closed).

#### Dependencies
- **npm/yarn**: Package management for Node.js dependencies
- **Git**: Version control for source code management
- **MySQL Client**: Database administration and setup

---

## 3. System Features and Requirements

### 3.1 Product Catalog Management

#### 3.1.1 Product Listing (FR-PC-001)

**Description:** The system shall display all available coffee products in a responsive grid layout.

**Priority:** High

**Inputs:**
- Optional query parameters: `search`, `category`

**Processing:**
1. Retrieve products from database
2. Apply search filter if `search` parameter provided
3. Apply category filter if `category` parameter provided
4. Return filtered product list

**Outputs:**
- JSON array of product objects containing:
  - `id`: Integer (unique identifier)
  - `name`: String (product name)
  - `description`: String (product description)
  - `price`: Decimal (unit price in USD)
  - `image_url`: String (product image URL)
  - `category`: String (product category)
  - `stock`: Integer (available quantity)

**Acceptance Criteria:**
- [ ] All products displayed with complete information
- [ ] Grid layout adapts to screen size (mobile, tablet, desktop)
- [ ] Out-of-stock products clearly indicated
- [ ] Search functionality filters by product name (case-insensitive)
- [ ] Category filter shows only matching products

#### 3.1.2 Product Detail View (FR-PC-002)

**Description:** The system shall display detailed information for a single product in a modal dialog.

**Priority:** High

**Inputs:**
- Product ID (from URL or component state)

**Processing:**
1. Fetch product details by ID
2. Display product information in modal overlay
3. Show quantity selector (1 to available stock)
4. Provide "Add to Cart" action button

**Outputs:**
- Modal dialog with:
  - Product image (large format)
  - Product name and category
  - Full description
  - Price per unit
  - Stock availability indicator
  - Quantity input control
  - Add to Cart button

**Acceptance Criteria:**
- [ ] Modal opens on product card click/tap
- [ ] All product details accurately displayed
- [ ] Quantity selector limited to available stock
- [ ] Modal closes on outside click or close button
- [ ] Add to Cart button disabled when out of stock

### 3.2 Shopping Cart Management

#### 3.2.1 Retrieve Cart (FR-SC-001)

**Description:** The system shall retrieve the current cart contents for a given session.

**Priority:** High

**Inputs:**
- `X-Session-Id`: String (custom HTTP header containing UUID v4)

**Processing:**
1. Extract session ID from `X-Session-Id` header
2. Query cart_items table by sessionId
3. Join with products table to get product details
4. Calculate line item totals (price × quantity)
5. Calculate cart subtotal

**Outputs:**
- JSON object containing:
  - `items`: Array of cart items with product details
  - `subtotal`: Decimal (sum of line item totals)
  - `itemCount`: Integer (total number of items)

**Acceptance Criteria:**
- [ ] Returns empty cart for new sessions
- [ ] Retrieves existing cart for returning sessions
- [ ] Includes current product prices (not historical)
- [ ] Handles deleted/unavailable products gracefully
- [ ] Session ID is read from header, NOT query parameters

#### 3.2.2 Add/Update Cart Item (FR-SC-002)

**Description:** The system shall add a new item to the cart or update quantity if item exists.

**Priority:** High

**Inputs:**
- `X-Session-Id`: String (custom HTTP header)
- `productId`: Integer
- `quantity`: Integer (positive, ≤ available stock)

**Processing:**
1. Extract session ID from `X-Session-Id` header
2. Validate product exists and has sufficient stock
3. Check if item already in cart for session
4. If exists: update quantity (upsert operation)
5. If new: create cart item record
6. Recalculate cart totals

**Outputs:**
- Updated cart object (same structure as FR-SC-001)
- HTTP status: 200 (success) or 400/404 (validation error)

**Acceptance Criteria:**
- [ ] Prevents adding more than available stock
- [ ] Updates existing items instead of duplicating
- [ ] Returns error for invalid product ID
- [ ] Returns error for quantity ≤ 0
- [ ] Persists cart across page refreshes (same session)
- [ ] Session ID is read from header, NOT request body or query parameters

#### 3.2.3 Update Cart Item Quantity (FR-SC-003)

**Description:** The system shall update the quantity of an existing cart item.

**Priority:** Medium

**Inputs:**
- `itemId`: Integer (cart item ID)
- `quantity`: Integer (new quantity, 0 removes item)

**Processing:**
1. Validate cart item exists
2. If quantity > 0: validate against product stock
3. Update quantity in database
4. If quantity = 0: remove item (alternative to DELETE)
5. Recalculate cart totals

**Outputs:**
- Updated cart object
- HTTP status: 200 (success) or 400/404 (error)

**Acceptance Criteria:**
- [ ] Updates quantity successfully
- [ ] Prevents exceeding available stock
- [ ] Removes item when quantity set to 0
- [ ] Returns error for non-existent item

#### 3.2.4 Remove Cart Item (FR-SC-004)

**Description:** The system shall remove an item from the cart.

**Priority:** Medium

**Inputs:**
- `itemId`: Integer (cart item ID)

**Processing:**
1. Verify cart item exists
2. Delete record from cart_items table
3. Recalculate cart totals

**Outputs:**
- Updated cart object
- HTTP status: 200 (success) or 404 (not found)

**Acceptance Criteria:**
- [ ] Removes item completely from cart
- [ ] Updates cart totals correctly
- [ ] Returns 404 for non-existent item
- [ ] Cart becomes empty after last item removal

### 3.3 Order Processing

#### 3.3.1 Checkout Validation (FR-OP-001)

**Description:** The system shall validate cart items before processing checkout.

**Priority:** Critical

**Inputs:**
- `X-Session-Id`: String (custom HTTP header)
- Cart items from request body or database

**Processing:**
1. Extract session ID from `X-Session-Id` header
2. Retrieve all cart items for session
3. For each item:
   - Verify product exists
   - Check current stock ≥ requested quantity
4. Calculate order total
5. Flag any stock discrepancies

**Outputs:**
- Validation result: { valid: Boolean, errors: Array }
- HTTP status: 200 (valid) or 400 (validation failed)

**Acceptance Criteria:**
- [ ] Rejects checkout if any item out of stock
- [ ] Rejects checkout if cart is empty
- [ ] Provides specific error messages for each issue
- [ ] Uses current stock levels (real-time check)
- [ ] Session ID is read from header, NOT query parameters

#### 3.3.2 Process Checkout (FR-OP-002)

**Description:** The system shall process a successful checkout and create an order.

**Priority:** Critical

**Inputs:**
- `X-Session-Id`: String (custom HTTP header)
- Validated cart items

**Processing:**
1. Extract session ID from `X-Session-Id` header
2. Begin database transaction
3. Create order record with status "pending"
4. For each cart item:
   - Decrement product stock
   - Optionally create order_item record (future enhancement)
5. Clear cart items for session
6. Commit transaction
7. Generate order confirmation

**Outputs:**
- Order confirmation object:
  - `orderId`: Integer
  - `total`: Decimal
  - `status`: String ("confirmed")
  - `estimatedDelivery`: Date (simulated)
- HTTP status: 200 (success) or 500 (transaction failed)

**Acceptance Criteria:**
- [ ] Creates order record atomically
- [ ] Updates stock levels correctly
- [ ] Clears cart after successful order
- [ ] Rolls back on any failure (transaction integrity)
- [ ] Returns order confirmation to customer
- [ ] Session ID is read from header, NOT request body
- [ ] Note: Shipping/billing details are omitted in v1.0 as payment is simulated. Future versions will require a `shippingDetails` object in the request body.

#### 3.3.3 Order Confirmation (FR-OP-003)

**Description:** The system shall display order confirmation to the customer.

**Priority:** High

**Inputs:**
- Order confirmation data from backend

**Processing:**
1. Display success message
2. Show order details (ID, total, estimated delivery)
3. Clear local cart state
4. Provide option to continue shopping

**Outputs:**
- Confirmation UI with:
  - Success indicator
  - Order number
  - Order total
  - Estimated delivery timeframe
  - "Continue Shopping" button

**Acceptance Criteria:**
- [ ] Displays immediately after successful checkout
- [ ] Shows all relevant order information
- [ ] Clears cart from UI
- [ ] Allows navigation back to product catalog

### 3.4 Search and Filtering

#### 3.4.1 Product Search (FR-SF-001)

**Description:** The system shall enable customers to search products by keyword.

**Priority:** High

**Inputs:**
- Search query string (from text input)

**Processing:**
1. Capture user input (debounced, 300ms delay)
2. Send GET request to `/api/products?search={query}`
3. Backend performs case-insensitive partial match on product name
4. Update UI with filtered results

**Outputs:**
- Filtered product list matching search criteria
- Empty state message if no matches

**Acceptance Criteria:**
- [ ] Searches product names (case-insensitive)
- [ ] Supports partial matches (e.g., "Ethi" matches "Ethiopian")
- [ ] Updates results in real-time (debounced)
- [ ] Clears filter when search input emptied
- [ ] Displays "No products found" for zero results

#### 3.4.2 Category Filtering (FR-SF-002)

**Description:** The system shall enable customers to filter products by category.

**Priority:** High

**Inputs:**
- Category selection (dropdown or button group)
- Available categories: "All", "Single Origin", "Blends"

**Processing:**
1. Capture category selection
2. Send GET request to `/api/products?category={category}`
3. Backend filters by exact category match
4. Update UI with filtered results

**Outputs:**
- Filtered product list for selected category
- Active filter indicator in UI

**Acceptance Criteria:**
- [ ] Filters by exact category match
- [ ] "All" category shows all products
- [ ] Combines with search filter (AND logic)
- [ ] Visual indication of active filter
- [ ] Resets on category change to "All"

### 3.5 User Interface Components

#### 3.5.1 Responsive Product Grid (FR-UI-001)

**Description:** The system shall display products in a responsive grid layout.

**Priority:** High

**Requirements:**
- Mobile (≤640px): 1 column
- Tablet (641px–1024px): 2 columns
- Desktop (>1024px): 3 columns
- Each product card shows: image, name, category, price, "View Details" button, stock status indicator
- Out-of-stock products display: greyed-out "View Details" button with "Out of Stock" text overlay
- Consistent spacing and alignment
- Coffee-inspired color palette (espresso, cream, amber, charcoal)

**Acceptance Criteria:**
- [ ] Layout adapts smoothly to viewport changes
- [ ] All product information visible without overflow
- [ ] Touch-friendly tap targets (≥44px)
- [ ] Consistent visual styling across breakpoints
- [ ] Out-of-stock products clearly indicated with visual overlay and disabled button

#### 3.5.2 Cart Sidebar (FR-UI-002)

**Description:** The system shall provide a slide-out cart sidebar.

**Priority:** High

**Requirements:**
- Slides in from right side of screen
- Overlay backdrop with click-to-close
- Displays cart items with:
  - Product thumbnail
  - Name and price
  - Quantity controls (+/- buttons)
  - Remove item button
- Shows subtotal and item count
- Checkout button (disabled if cart empty)
- Close button (X icon)
- Loading state: skeleton loader or spinner when fetching cart data

**Acceptance Criteria:**
- [ ] Opens/closes smoothly with animation
- [ ] Updates in real-time when cart changes
- [ ] Quantity controls function correctly
- [ ] Checkout button enabled only with items
- [ ] Accessible via keyboard (Tab, Enter, Escape)
- [ ] Displays loading indicator during API calls

#### 3.5.3 Product Modal (FR-UI-003)

**Description:** The system shall display product details in a modal dialog.

**Priority:** High

**Requirements:**
- Centered overlay modal
- Large product image
- Complete product information
- Quantity selector (numeric input or +/- buttons)
- "Add to Cart" button
- Close button and outside-click dismissal
- Focus trapping for accessibility
- Loading state: skeleton loader for product image and details while fetching

**Acceptance Criteria:**
- [ ] Modal appears centered on screen
- [ ] Background scroll disabled when open
- [ ] All product details accurate and readable
- [ ] Quantity limited to available stock
- [ ] Closes on Escape key press
- [ ] Focus returns to trigger element on close
- [ ] Displays loading indicator during product fetch

#### 3.5.4 Navigation Bar (FR-UI-004)

**Description:** The system shall provide a persistent navigation bar.

**Priority:** Medium

**Requirements:**
- Fixed position at top of viewport
- Brand logo/name on left
- Cart icon with item count badge on right
- Warm coffee color scheme
- Responsive design (hamburger menu on mobile if needed)

**Acceptance Criteria:**
- [ ] Visible on all pages/views
- [ ] Cart badge updates in real-time
- [ ] Clicking cart icon opens cart sidebar
- [ ] Maintains visibility during scroll
- [ ] Displays role-appropriate menu items based on authentication status

---

### 3.6 User Authentication and Authorization

#### 3.6.1 User Registration (FR-UA-001)

**Description:** The system shall allow users to create a registered customer account.

**Priority:** High

**Inputs:**
- Email address (valid format)
- Password (minimum 8 characters, must contain uppercase, lowercase, number)
- First name
- Last name
- Optional: Phone number

**Processing:**
1. Validate input fields using Zod schema
2. Check email uniqueness against database
3. Hash password using bcrypt (salt rounds: 12)
4. Create user record with `customer` role
5. Generate JWT token for session
6. Send welcome email (future enhancement)

**Outputs:**
- User account created successfully
- JWT token stored in HTTP-only cookie
- Redirect to account dashboard or previous page

**Acceptance Criteria:**
- [ ] Email validation prevents duplicate accounts
- [ ] Password strength requirements enforced
- [ ] Secure password hashing implemented
- [ ] JWT token issued on successful registration
- [ ] Error messages displayed for validation failures
- [ ] Welcome message shown on success

**Applicable Roles:** Guest User (to become Registered Customer)

#### 3.6.2 User Login (FR-UA-002)

**Description:** The system shall authenticate registered users and establish a secure session.

**Priority:** High

**Inputs:**
- Email address
- Password

**Processing:**
1. Validate input format
2. Look up user by email
3. Verify password hash using bcrypt
4. Generate JWT token with user ID and role claims
5. Set HTTP-only, Secure, SameSite cookie with token
6. Update last login timestamp

**Outputs:**
- Authentication success/failure response
- JWT token in HTTP-only cookie
- User profile data (name, role, preferences)

**Acceptance Criteria:**
- [ ] Invalid credentials return generic error (security best practice)
- [ ] Successful login redirects to previous page or dashboard
- [ ] JWT token includes user ID and role
- [ ] Cookie settings: HttpOnly, Secure, SameSite=Strict
- [ ] Failed login attempts logged (rate limiting applied)
- [ ] "Remember me" option extends token expiration

**Applicable Roles:** Guest User, Registered Customer, Content Manager, Order Staff, System Admin

#### 3.6.3 User Logout (FR-UA-003)

**Description:** The system shall allow users to securely end their session.

**Priority:** High

**Inputs:**
- Logout request (button click)

**Processing:**
1. Invalidate JWT token (add to blacklist/allow to expire)
2. Clear HTTP-only cookie
3. Clear client-side user state
4. Redirect to home page

**Outputs:**
- Session terminated
- User redirected to guest view

**Acceptance Criteria:**
- [ ] Cookie cleared on logout
- [ ] Client state reset
- [ ] User cannot access protected routes after logout
- [ ] Confirmation message displayed

**Applicable Roles:** All authenticated roles

#### 3.6.4 Password Reset (FR-UA-004)

**Description:** The system shall allow users to reset forgotten passwords.

**Priority:** Medium

**Inputs:**
- Email address (for reset request)
- Reset token (from email link)
- New password (confirmed)

**Processing:**
1. Generate secure reset token (UUID v4)
2. Store token hash with expiration (1 hour)
3. Send reset email with token link (future: email integration)
4. Validate token on reset submission
5. Hash new password and update user record
6. Invalidate all existing tokens for user

**Outputs:**
- Reset email sent (simulated in v1.0)
- Password updated successfully
- Auto-login after reset (optional)

**Acceptance Criteria:**
- [ ] Reset token expires after 1 hour
- [ ] Token can only be used once
- [ ] New password must meet strength requirements
- [ ] All existing sessions invalidated after reset
- [ ] Confirmation email sent after successful reset

**Applicable Roles:** Registered Customer, Content Manager, Order Staff, System Admin

#### 3.6.5 Role-Based Access Control (FR-UA-005)

**Description:** The system shall enforce role-based permissions for all protected resources.

**Priority:** Critical

**Inputs:**
- User JWT token with role claim
- Requested resource/action

**Processing:**
1. Extract role from JWT token
2. Check role permissions against requested action
3. Allow or deny access based on permissions matrix
4. Log unauthorized access attempts

**Outputs:**
- Access granted (proceed with request)
- Access denied (403 Forbidden response)
- Redirect to appropriate dashboard based on role

**Acceptance Criteria:**
- [ ] All API endpoints verify user role
- [ ] Frontend routes protected by role guards
- [ ] Unauthorized access returns 403 Forbidden
- [ ] Admin-only features invisible to non-admin roles
- [ ] Audit log records permission violations

**Applicable Roles:** All roles (enforcement mechanism)

#### 3.6.6 User Profile Management (FR-UA-006)

**Description:** Registered customers shall be able to view and update their profile information.

**Priority:** High

**Inputs:**
- Current user data (retrieved from database)
- Updated fields: first name, last name, email, phone, password

**Processing:**
1. Authenticate user (verify current session)
2. Validate updated fields
3. If email changed, verify uniqueness
4. If password changed, verify current password and hash new one
5. Update user record
6. Invalidate tokens if sensitive data changed (optional)

**Outputs:**
- Updated user profile
- Confirmation message
- Updated JWT if role/permissions changed

**Acceptance Criteria:**
- [ ] Users can update name, email, phone
- [ ] Email change requires verification (future)
- [ ] Password change requires current password confirmation
- [ ] Profile updates reflect immediately
- [ ] Validation errors displayed appropriately

**Applicable Roles:** Registered Customer, Content Manager, Order Staff, System Admin

#### 3.6.7 Saved Addresses Management (FR-UA-007)

**Description:** Registered customers shall be able to save and manage shipping/billing addresses.

**Priority:** Medium

**Inputs:**
- Address details: street, city, state, ZIP, country
- Address type: shipping, billing, both
- Default address flag

**Processing:**
1. Validate address format
2. Save address to user's address book
3. Allow setting default shipping/billing address
4. Support multiple addresses per user

**Outputs:**
- Address saved successfully
- List of saved addresses
- Default address indicators

**Acceptance Criteria:**
- [ ] Users can add multiple addresses
- [ ] Users can set default shipping/billing
- [ ] Users can edit/delete saved addresses
- [ ] Addresses validated for completeness
- [ ] Default address used at checkout

**Applicable Roles:** Registered Customer

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Visual Design Standards

**Color Palette:**
```css
/* Espresso Tones */
--espresso-50: #f8f6f4;      /* Lightest background */
--espresso-500: #8a6d57;     /* Primary buttons, accents */
--espresso-700: #5a4236;     /* Secondary elements */
--espresso-900: #3d2d26;     /* Primary text */

/* Cream Tones */
--cream-50: #fefdfb;         /* Main background */
--cream-100: #fdf8f0;        /* Card backgrounds */
--cream-200: #faefdc;        /* Borders, dividers */

/* Amber Accent */
--amber: #d4a017;            /* Highlights, badges, stars */

/* Charcoal */
--charcoal: #2d2d2d;         /* Dark text, footers */
```

**Typography:**
- Primary Font: System sans-serif stack (Inter, SF Pro, Segoe UI)
- Headings: Bold weight, espresso-900 color
- Body: Regular weight, charcoal color
- Prices: Semi-bold, espresso-700 color

**Spacing Scale:**
- Base unit: 4px
- Common values: 4px, 8px, 16px, 24px, 32px, 48px, 64px

#### 4.1.2 Responsive Breakpoints

| Breakpoint | Min Width | Max Width | Layout |
|------------|-----------|-----------|--------|
| Mobile | 0px | 640px | Single column, stacked elements |
| Tablet | 641px | 1024px | Two-column grid, compact navigation |
| Desktop | 1025px | ∞ | Three-column grid, full navigation |

### 4.2 Hardware Interfaces

No specific hardware interfaces required. System operates on standard computing devices:

- **Desktop/Laptop**: Any device with modern web browser
- **Tablet**: iPad, Android tablets with touch support
- **Mobile**: iOS Safari, Chrome for Android

### 4.3 Software Interfaces

#### 4.3.1 Backend API Interfaces

**Base URL:** `http://localhost:5000/api`

**Endpoints:**

| Method | Endpoint | Description | Request Headers | Request Body | Response |
|--------|----------|-------------|-----------------|--------------|----------|
| GET | `/products` | List products | None | None | Product[] |
| GET | `/products/:id` | Get product | None | None | Product |
| GET | `/cart` | Get cart | `X-Session-Id: <uuid>` | None | Cart |
| POST | `/cart` | Add/update item | `X-Session-Id: <uuid>` | `{productId, quantity}` | Cart |
| PUT | `/cart/:id` | Update item | `X-Session-Id: <uuid>` | `{quantity}` | Cart |
| DELETE | `/cart/:id` | Remove item | `X-Session-Id: <uuid>` | None | Cart |
| POST | `/checkout` | Process order | `X-Session-Id: <uuid>` | `{}` (v1.0 simulated; future: `shippingDetails`) | OrderConfirmation |

**Request/Response Format:**
- Content-Type: `application/json`
- Character Encoding: UTF-8

**Error Response Format:**
```json
{
  "error": "Error message description",
  "details": {},
  "statusCode": 400,
  "timestamp": "2026-09-08T12:34:56.789Z"
}
```

**Example Error Responses:**

*Validation Error (400 Bad Request):*
```json
{
  "error": "Validation failed",
  "details": {
    "productId": "Product ID must be a positive integer",
    "quantity": "Quantity must be between 1 and available stock"
  },
  "statusCode": 400,
  "timestamp": "2026-09-08T12:34:56.789Z"
}
```

*Not Found Error (404 Not Found):*
```json
{
  "error": "Resource not found",
  "details": {
    "resource": "Product",
    "id": 999
  },
  "statusCode": 404,
  "timestamp": "2026-09-08T12:34:56.789Z"
}
```

*Server Error (500 Internal Server Error):*
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred. Please try again later.",
  "statusCode": 500,
  "timestamp": "2026-09-08T12:34:56.789Z"
}
```

**Security Note:** Session IDs must NEVER be passed as query parameters. All session-related requests MUST use the `X-Session-Id` custom HTTP header to prevent session ID leakage in browser history, server logs, and Referer headers.

#### 4.3.2 Database Interface

**Database:** MySQL v8.0+  
**Connection:** Via Prisma ORM  
**Tables:**
- `products`: Product catalog
- `cart_items`: Session-based shopping cart
- `orders`: Order history

**Connection String Format:**

Example: `mysql://coffee_user:secure_password@localhost:3306/specialty_coffee_db`

**Environment Variable Configuration:**
```bash
DATABASE_URL="mysql://username:password@host:port/database_name"
```

**Best Practices:**
- Never commit credentials to version control
- Use environment variables or secure secrets management
- Implement connection pooling for production deployments

### 4.4 Communications Interfaces

**Protocol:** HTTP/1.1 (development), HTTPS (production recommended)

**Ports:**
- Frontend: 5173 (Vite dev server)
- Backend: 5000 (Express server)
- Database: 3306 (MySQL default)

**CORS Configuration:**
- Allowed Origins: `http://localhost:5173` (development)
- Allowed Methods: GET, POST, PUT, DELETE
- Allowed Headers: Content-Type, Authorization
- Credentials: Included (for session cookies if implemented)

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Page Load Time | < 3 seconds | From navigation to interactive |
| API Response Time | < 500ms | 95th percentile |
| Product Grid Render | < 1 second | For 6 products |
| Cart Update | < 300ms | After user action |
| Search Results | < 400ms | Debounced input to display |

**Capacity:**
- Concurrent Users: Support up to 100 simultaneous users (development scale)
- Product Catalog: Optimized for 6–50 products
- Cart Items: Maximum 50 items per cart

### 5.2 Security Requirements

#### 5.2.1 Data Protection

- **Input Validation**: All user inputs validated using Zod schemas
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM
- **XSS Prevention**: React's built-in XSS protection, sanitized outputs
- **CORS Policy**: Restrictive origin policy allowing only trusted domains
- **Password Security**: Bcrypt hashing with 12 salt rounds, minimum 8 characters with complexity requirements
- **JWT Security**: Short-lived tokens (15 minutes), refresh token rotation, secure storage in HTTP-only cookies

#### 5.2.2 Authentication and Session Management

- **Session Token Storage**: JWT tokens stored in HTTP-only, Secure, SameSite=Strict cookies
- **Token Expiration**: Access tokens expire after 15 minutes; refresh tokens expire after 7 days
- **Session ID Handling**: Session IDs MUST NEVER be passed as query parameters. All session-related requests MUST use the `X-Session-Id` custom HTTP header or HTTP-only cookies to prevent session ID leakage in browser history, server logs, and Referer headers.
- **Rate Limiting**: Failed login attempts limited to 5 per IP address per 15 minutes
- **Account Lockout**: Temporary lockout after 10 consecutive failed login attempts
- **Secure Logout**: Token invalidation on logout, cookie clearing, client state reset

#### 5.2.3 Authorization and Role-Based Access Control

- **Role Verification**: All protected API endpoints verify user role from JWT claims
- **Principle of Least Privilege**: Users granted minimum permissions necessary for their role
- **Permission Matrix Enforcement**: Frontend and backend both enforce role permissions
- **Unauthorized Access Handling**: 403 Forbidden response for unauthorized access attempts
- **Audit Logging**: All permission violations logged with timestamp, user ID, role, and requested resource

#### 5.2.4 Error Handling

- Generic error messages to users (no stack traces or sensitive information)
- Detailed logging on server for debugging (excluding passwords and tokens)
- Graceful degradation on API failures
- Custom error pages for 404 and 500 errors

#### 5.2.5 Role-Specific Security Requirements

| Role | Security Requirements |
|------|----------------------|
| **Guest User** | No PII stored beyond session; cart data cleared on session end |
| **Registered Customer** | Encrypted password storage, secure profile access, order history isolation |
| **Content Manager** | Product modification audit trail, inventory change logging |
| **Order Staff** | Order status change audit trail, customer data access restricted to fulfillment needs |
| **System Admin** | Multi-factor authentication recommended, full audit log access, sensitive operation confirmation |

### 5.3 Reliability Requirements

| Metric | Target |
|--------|--------|
| Availability | 99% (development), 99.9% (production target) |
| Mean Time Between Failures (MTBF) | > 720 hours |
| Mean Time To Recovery (MTTR) | < 30 minutes |
| Data Integrity | 100% (transactional consistency) |

**Fault Tolerance:**
- Database transactions for order processing (rollback on failure)
- Graceful handling of database connection losses
- Frontend error boundaries prevent complete app crashes

### 5.4 Maintainability Requirements

**Code Quality:**
- Modular architecture (controllers, routes, schemas separated)
- Consistent naming conventions
- Inline comments for complex logic
- README documentation for setup and deployment

**Testing:**
- Unit tests for utility functions (recommended addition)
- Integration tests for API endpoints (recommended addition)
- End-to-end tests for critical user flows (recommended addition)

**Version Control:**
- Git repository with meaningful commit messages
- Feature branches for new development
- Main branch always deployable

### 5.5 Usability Requirements

**Accessibility:**
- WCAG 2.1 Level AA compliance target
- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels for interactive elements
- Focus indicators for keyboard users
- Color contrast ratio ≥ 4.5:1 for normal text

**User Experience:**
- Intuitive navigation (no training required)
- Consistent interaction patterns
- Clear feedback on user actions (loading states, success/error messages)
- Mobile-first responsive design
- Touch-friendly interface elements (minimum 44×44px)

**Localization:**
- English language support (initial release)
- Currency: USD ($)
- **Future Enhancement**: Multi-language and multi-currency support

### 5.6 Scalability Requirements

**Current Architecture Limitations:**
- Session-based cart stored in database (not scalable for high traffic)
- No caching layer (Redis, CDN)
- Single database instance

**Scalability Recommendations for Production:**
1. Implement Redis for session/cart caching
2. Add database read replicas for product queries
3. Deploy behind load balancer for horizontal scaling
4. Use CDN for static assets (images, CSS, JS)
5. Implement database connection pooling

---

## 6. Appendix

### 6.1 Sample Data

**Products (Initial Seed Data):**

| ID | Name | Category | Price | Stock |
|----|------|----------|-------|-------|
| 1 | Ethiopian Yirgacheffe | Single Origin | $24.99 | 100 |
| 2 | Colombian Supremo | Single Origin | $19.99 | 150 |
| 3 | Espresso Reserve Blend | Blends | $22.99 | 120 |
| 4 | Guatemala Antigua | Single Origin | $21.99 | 80 |
| 5 | Breakfast Blend | Blends | $18.99 | 200 |
| 6 | Sumatra Mandheling | Single Origin | $23.99 | 90 |

### 6.2 Entity Relationship Diagram

```mermaid
erDiagram
    PRODUCT ||--o{ CARTITEM : contains
    PRODUCT ||--o{ ORDERITEM : "ordered in"
    CARTITEM }o--|| SESSION : belongs_to
    ORDER ||--o{ ORDERITEM : contains
    ORDER }o--|| SESSION : placed_by

    PRODUCT {
        int id PK
        string name
        string description
        decimal price
        string image_url
        string category
        int stock
        datetime createdAt
        datetime updatedAt
    }

    SESSION {
        string id PK "UUID v4"
        datetime createdAt
        datetime expiresAt
    }

    CARTITEM {
        int id PK
        string sessionId FK
        int productId FK
        int quantity
        datetime createdAt
        datetime updatedAt
    }

    ORDER {
        int id PK
        string sessionId FK
        decimal total
        string status "pending|confirmed|shipped|cancelled"
        datetime createdAt
    }

    ORDERITEM {
        int id PK
        int orderId FK
        int productId FK
        int quantity
        decimal unitPrice
    }
```

**Relationships:**
- **Product (1) → (N) CartItem**: A product can be in multiple carts; cascade delete on product removal
- **Product (1) → (N) OrderItem**: A product can appear in many orders
- **Session (1) → (N) CartItem**: One session owns multiple cart items
- **Session (1) → (N) Order**: One session can place multiple orders
- **Order (1) → (N) OrderItem**: Each order contains multiple line items
- **CartItem references Product via productId**: Foreign key with CASCADE on delete
- **Order is linked to Session via sessionId**: Enables cart-to-order conversion

**Note:** If Mermaid.js rendering is unavailable, refer to the ASCII diagram below:

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Product   │       │   CartItem   │       │   Session   │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ productId(FK)│       │ id (PK)     │
│ name        │       │ quantity     │──────►│ uuid        │
│ description │       │ sessionId(FK)│       │ createdAt   │
│ price       │       │ createdAt    │       │ expiresAt   │
│ image_url   │       └──────────────┘       └─────────────┘
│ category    │                │
│ stock       │                │
│ createdAt   │                ▼
└─────────────┘       ┌─────────────┐
                      │    Order    │
                      ├─────────────┤
                      │ id (PK)     │
                      │ sessionId   │
                      │ total       │
                      │ status      │
                      │ createdAt   │
                      └─────────────┘
```

### 6.3 User Role Database Schema

**Users Table:**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // bcrypt hashed
  firstName String
  lastName  String
  phone     String?
  role      UserRole @default(CUSTOMER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
  
  addresses Address[]
  orders    Order[]
  
  @@map("users")
}

enum UserRole {
  GUEST
  CUSTOMER
  CONTENT_MANAGER
  ORDER_STAFF
  SYSTEM_ADMIN
}
```

**Addresses Table:**
```prisma
model Address {
  id         Int     @id @default(autoincrement())
  userId     Int
  user       User    @relation(fields: [userId], references: [id])
  street     String
  city       String
  state      String
  zipCode    String
  country    String  @default("USA")
  isDefault  Boolean @default(false)
  type       AddressType
  
  @@map("addresses")
}

enum AddressType {
  SHIPPING
  BILLING
  BOTH
}
```

### 6.4 Technology Stack Summary

**Backend:**
- Runtime: Node.js v18+
- Framework: Express.js v4.x
- ORM: Prisma v5.x
- Database: MySQL v8.0+
- Validation: Zod v3.x
- CORS: cors middleware

**Frontend:**
- Library: React 18.x
- Build Tool: Vite v5.x
- Styling: Tailwind CSS v3.x
- State Management: React Context API
- HTTP Client: Native Fetch API
- Custom Hooks: useModal, useProducts

**Development Tools:**
- Package Manager: npm/yarn
- Version Control: Git
- Database Client: MySQL Workbench / CLI
- API Testing: Postman / curl

### 6.4 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-08 | System Architect | Initial SRS document creation with security revisions: session ID in headers (not query params), complete ERD with Mermaid, error response schemas, loading state requirements, out-of-stock UI indicators |
| 1.1 | 2026-09-08 | System Architect | Added comprehensive user roles (Guest, Registered Customer, Content Manager, Order Staff, System Admin) with permissions matrix, role characteristics, authentication/authorization requirements (FR-UA-001 through FR-UA-007), enhanced security NFRs with role-based access control, user database schema with UserRole enum, updated future enhancements and approval section |

### 6.5 Open Issues and Future Enhancements

**Known Limitations:**
1. Basic authentication implemented; advanced features pending
2. Session-based cart for guest users (lost on browser close)
3. Simulated payment processing (no real gateway)
4. Limited order tracking view for customers
5. Admin panel requires full implementation

**Recommended Future Enhancements:**
1. Enhanced user authentication with MFA for admin roles
2. Persistent user accounts with complete order history
3. Payment gateway integration (Stripe, PayPal)
4. Email notifications for order confirmations and status updates
5. Full-featured admin dashboard for CRUD operations on products, users, and orders
6. Product reviews and ratings system
7. Advanced search with facets (price range, roast level, origin country)
8. Wishlist functionality
9. Subscription model for recurring coffee orders
10. Multi-language and multi-currency support
11. Social login integration (Google, Facebook)
12. Loyalty rewards program
13. Gift card functionality
14. Advanced analytics dashboard for admins

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | _________________ | _________________ | _________________ |
| Lead Developer | _________________ | _________________ | _________________ |
| QA Manager | _________________ | _________________ | _________________ |
| Security Officer | _________________ | _________________ | _________________ |

---

**© 2026 Specialty Coffee Shop. All rights reserved.**

*This document contains proprietary information and should not be distributed without authorization.*
