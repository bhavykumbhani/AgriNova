# AgriNova
### Smart Agriculture Marketplace and Decision Support System

AgriNova is a digital agriculture platform connecting Indian farmers directly with bulk crop buyers and merchants. The platform eliminates intermediaries, enables direct farmer-to-buyer transactions, and provides intelligent decision support powered by live satellite agro-meteorological forecasts and APMC mandi market intelligence.

---

## Phase 4: Real Authentication + Farmer & Buyer Applications

Phase 4 transforms AgriNova from a public-facing website into a secure, role-governed marketplace application:

1. **Elimination of Fake Authentication**:
   - Removed all dummy logins, mock users, hardcoded passwords, and client-only bypasses.
   - Authentication strictly requires a validated session from Supabase Auth (`supabase.auth.signInWithPassword`).
   - Profile verification queries the database `profiles` table to resolve genuine roles (`farmer`, `buyer`, `admin`).
   - Protected routes (`ProtectedRoute`, `RoleRoute`) strictly reject unauthenticated or mismatched-role visits with zero flash of unauthorized dashboards.

2. **Farmer Portal (`FarmerLayout` + `/farmer/*`)**:
   - **Dashboard (`/farmer/dashboard`)**:
     - Personalized greeting using real database profile name.
     - 4 Real KPI Cards: Total Revenue (calculated from completed orders, ₹0 if none), Products Listed, Completed Orders, Active Buyers.
     - **Revenue Analytics**: Interactive Area chart powered by **Recharts** with time filters (7D, 30D, 3M, 6M, 1Y).
     - **Live Farm Weather**: Real-time agro-meteorological satellite telemetry tailored to the farmer's registered farm coordinates via Open-Meteo.
     - **Recent Orders Table**: Latest incoming buyer purchase requests.
   - **My Products (`/farmer/products`)**:
     - Full crop inventory management with search, category filtering, and status filtering (`Active`, `Draft`, `Sold Out`, `Inactive`).
     - Soft deletion to safeguard historical purchase contracts.
   - **List New Crop (`/farmer/products/new`) & Edit (`/farmer/products/:id/edit`)**:
     - Standardized crop categories, quality grades, quantity with unit selectors (quintal, tonne, kg).
     - Price per quintal (₹) normalization.
     - Multi-image uploads directly to Supabase Storage bucket (`product-images`) with primary image badge selection.
   - **Orders (`/farmer/orders`, `/farmer/orders/:id`)**:
     - Order status lifecycle: `Pending` → `Accepted` / `Rejected` → `Confirmed` → `Processing` → `Shipped` → `Completed`.
     - Inventory reservation: automatically decrements available quantity on acceptance, prevents negative stock, and restores stock on order cancellation.
     - Preserves immutable unit price snapshots at time of order creation.
   - **Buyer Directory (`/farmer/buyers`)**:
     - Discover verified bulk buyers, retailers, processors, and exporters with direct messaging.
   - **Realtime Messages (`/farmer/messages`)**:
     - WhatsApp-style chat powered by **Socket.IO** and backed by PostgreSQL database persistence.
     - Shows typing indicators, read receipts, and handles offline message history.
   - **Profile & Settings (`/farmer/profile`, `/farmer/settings`)**:
     - Farm location, area, and crop capabilities with immutable email and role protection.
     - Language switcher (English, Hindi, Gujarati) and Dark/Light theme toggles.

3. **Buyer Portal (`BuyerLayout` + `/buyer/*`)**:
   - **Dashboard (`/buyer/dashboard`)**:
     - KPI cards: Active Orders, Completed Orders, Saved Products, Farmers Connected, Total Purchase Value.
     - Recent orders list with quick fulfillment tracking.
   - **Marketplace (`/buyer/marketplace`, `/buyer/marketplace/:id`)**:
     - Search and filter harvest listings by category, price, and location.
     - Rich product details with multi-image gallery, quality grade, and farmer credentials.
     - "Request Purchase Quote" modal: specifies required volume, delivery instructions, and auto-calculates total order cost.
     - "Save Product" toggle for watchlist management.
   - **My Orders (`/buyer/orders`, `/buyer/orders/:id`)**:
     - Real-time order progress tracking and cancellation of pending orders.
   - **Saved Products (`/buyer/saved`)**:
     - Watchlist of saved harvest lots for future procurement.
   - **Farmers Directory (`/buyer/farmers`)**:
     - Directory of verified producers categorized by farm area and primary crops.
   - **Realtime Messages (`/buyer/messages`)**:
     - Direct instant messaging with producers to negotiate contract terms, logistics, and discounts.
   - **Profile & Settings (`/buyer/profile`, `/buyer/settings`)**:
     - Company credentials, GSTIN, business type, warehouse address, and theme/language controls.

4. **Realtime Socket.IO Communication**:
   - Server attaches Socket.IO with CORS validation.
   - Handshake authentication verifies the Supabase JWT Bearer token before permitting connections.
   - Room-based isolation (`conversation:{id}`) prevents unauthorized third parties from joining or reading private conversations.
   - All messages are validated, sanitized for XSS, persisted into PostgreSQL `messages` table, and updated in `conversations`.

---

## Architecture Overview

```
AgriNova/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Registration steps, role selection, success screen
│   │   │   ├── common/         # Button, Card, Badge, Modal, ConfirmModal, ThemeToggle
│   │   │   ├── layout/         # PublicLayout, FarmerLayout, BuyerLayout, Navbar, Footer
│   │   │   ├── weather/        # WeatherDashboard (Open-Meteo GPS)
│   │   │   └── marketplace/    # MarketPrice previews
│   │   ├── context/            # AuthContext, ToastContext, ThemeContext, LanguageContext
│   │   ├── locales/            # en/, hi/, gu/ (dashboard, common, auth, home, etc.)
│   │   ├── pages/
│   │   │   ├── auth/           # LoginPage, Register pages, ForgotPasswordPage
│   │   │   ├── farmer/         # Dashboard, Products, Orders, Buyers, Messages, Profile, Settings
│   │   │   └── buyer/          # Dashboard, Marketplace, Details, Orders, Saved, Farmers, Messages
│   │   ├── routes/             # AppRoutes.jsx (RoleRoute & ProtectedRoute)
│   │   └── services/           # productService, orderService, messageService, socket, storageService
│   ├── .env.example
│   └── package.json
├── server/
│   ├── config/                 # env.js, supabase.js
│   ├── controllers/            # productController, orderController, messageController, analyticsController
│   ├── middleware/             # authMiddleware.js (Supabase JWT verification)
│   ├── routes/                 # productRoutes, orderRoutes, messageRoutes, analyticsRoutes, etc.
│   ├── socket/                 # Socket.IO connection & room authorization handlers
│   ├── sql/
│   │   ├── schema.sql          # Base schema
│   │   └── phase4_migration.sql# Phase 4 tables, triggers, indexes, and RLS policies
│   ├── .env.example
│   └── package.json
└── package.json
```

---

## Database Migrations & Supabase Setup

### 1. Execute SQL Migrations
In your Supabase Dashboard:
1. Navigate to **SQL Editor**.
2. Run `server/sql/schema.sql` (if creating fresh) or `server/sql/phase4_migration.sql`.
3. The migration sets up:
   - `public.products` & `public.product_images`
   - `public.orders` (with auto-generating `AGN-YYYY-000XXX` order numbers)
   - `public.saved_products`
   - `public.conversations` & `public.messages`
   - `public.notifications`
   - Row Level Security (RLS) policies ensuring farmers manage only their own products, and buyers/farmers access only their own orders and conversations.

### 2. Storage Configuration
Create a public or RLS-protected storage bucket in Supabase named:
```text
product-images
```
Ensure public read access is enabled so marketplace listings can display product photos.

---

## Environment Variables

### Client (`client/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Server (`server/.env`)
```env
PORT=5000
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
EMAIL_FROM_NAME=AgriNova
EMAIL_FROM_ADDRESS=your-email@gmail.com

OTP_EXPIRY_MINUTES=10
OTP_RESEND_SECONDS=60
```

---

## Running Locally

1. **Client (Vite)**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Accessible at `http://localhost:5173`

2. **Server (Express & Socket.IO)**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Accessible at `http://localhost:5000`

---

## Deployment Considerations

- **Frontend (Vercel)**:
  - Add build command: `npm run build`
  - Output directory: `dist`
  - Configure environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`, `VITE_SOCKET_URL`.
- **Backend (Render / Railway / VPS)**:
  - Must support WebSockets for Socket.IO realtime messaging.
  - Set `CLIENT_URL` to your production frontend URL (e.g., `https://agri-nova-three-orcin.vercel.app`).
  - Keep `SUPABASE_SERVICE_ROLE_KEY` and `EMAIL_PASS` confidential in server environment variables only.
