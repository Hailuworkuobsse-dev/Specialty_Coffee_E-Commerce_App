# Specialty Coffee Shop - Full Stack E-Commerce Application

A production-ready specialty coffee e-commerce web application built with React.js (Frontend) and Node.js/Express (Backend), featuring six premium coffee products with a warm, refined visual design.

## 🎨 Design Philosophy

The application features a sophisticated coffee-inspired color palette:
- **Espresso tones** - Deep browns for primary elements
- **Rich creams** - Warm off-whites for backgrounds
- **Warm ambers** - Golden accents for highlights
- **Deep charcoals** - Dark neutrals for text

## 📁 Project Structure

```
specialty-coffee-shop/
├── backend/                 # Node.js + Express API
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Database seeding script
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Zod validation schemas
│   │   └── server.js       # Express server entry point
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/               # React.js + Vite + Tailwind CSS
    ├── public/
    ├── src/
    │   ├── api/           # API client layer
    │   ├── components/    # Reusable UI components
    │   ├── context/       # React Context providers
    │   ├── hooks/         # Custom React hooks
    │   ├── App.jsx        # Main application component
    │   ├── main.jsx       # React entry point
    │   └── index.css      # Global styles + Tailwind
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0+)
- **Git**

### 1. Clone and Navigate

```bash
cd specialty-coffee-shop
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE specialty_coffee_db;"

# Configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Generate Prisma client and run migrations
npm run db:setup

# Start the development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📦 Features

### Backend (Node.js + Express + Prisma + MySQL)

- **RESTful API** with comprehensive endpoints
- **Prisma ORM** for type-safe database access
- **Zod Validation** for request payload validation
- **CORS Configuration** for secure cross-origin requests
- **Stock Management** with real-time inventory checks
- **Session-based Cart** persistence
- **Order Processing** with simulated checkout flow

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (supports search & category filter) |
| GET | `/api/products/:id` | Get single product by ID |
| GET | `/api/cart?sessionId=` | Retrieve cart items |
| POST | `/api/cart` | Add/update item in cart |
| PUT | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/checkout` | Process checkout and create order |

### Frontend (React.js + Tailwind CSS)

- **Responsive Design** - Mobile-first approach
- **Product Grid** - Dynamic filtering and search
- **Product Modal** - Detailed view with quantity selector
- **Cart Sidebar** - Slide-out cart with real-time updates
- **Checkout Simulation** - Order processing with success feedback
- **Custom Hooks** - Reusable state management logic
- **Context API** - Global cart state management

### Sample Products

The database is seeded with six premium specialty coffees:

1. **Ethiopian Yirgacheffe** - Single Origin ($24.99)
2. **Colombian Supremo** - Single Origin ($19.99)
3. **Espresso Reserve Blend** - Blends ($22.99)
4. **Guatemala Antigua** - Single Origin ($21.99)
5. **Breakfast Blend** - Blends ($18.99)
6. **Sumatra Mandheling** - Single Origin ($23.99)

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Validation**: Zod
- **CORS**: cors middleware

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **HTTP Client**: Fetch API

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
npm run db:setup         # Run all setup commands
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🎨 Color Palette

```css
/* Espresso Tones */
--espresso-50: #f8f6f4
--espresso-500: #8a6d57
--espresso-700: #5a4236
--espresso-900: #3d2d26

/* Cream Tones */
--cream-50: #fefdfb
--cream-100: #fdf8f0
--cream-200: #faefdc

/* Amber Accent */
--amber: #d4a017

/* Charcoal */
--charcoal: #2d2d2d
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://root:password@localhost:3306/specialty_coffee_db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend
No environment variables required for local development. The API client automatically proxies requests to the backend.

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify DATABASE_URL in `.env` matches your MySQL credentials
- Check that the database exists: `CREATE DATABASE specialty_coffee_db;`

### CORS Errors
- Ensure backend PORT matches FRONTEND_URL in backend `.env`
- Verify frontend is running on port 5173 (or update proxy in `vite.config.js`)

### Prisma Errors
- Run `npm run prisma:generate` after any schema changes
- Ensure migrations are applied: `npm run prisma:migrate`

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built with ❤️ for coffee lovers everywhere.

---

**Enjoy brewing and coding!** ☕
