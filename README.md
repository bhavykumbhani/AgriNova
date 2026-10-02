# AgriNova
### Smart Agriculture Marketplace and Decision Support System

AgriNova is a production-grade digital agriculture platform connecting Indian farmers directly with bulk crop buyers and merchants. The platform eliminates intermediaries, enables direct farmer-to-buyer transactions, and provides intelligent decision support powered by live satellite agro-meteorological forecasts and APMC mandi market intelligence.

---

## What Was Added in Phase 2

1. **Complete Role-Based Registration (`/register`)**:
   - Distinct **Farmer** and **Buyer** onboarding pathways.
   - Large, accessible, responsive Modern Agri-Tech role cards.

2. **Farmer Multi-Step Registration (`/register/farmer`)**:
   - **Step 1: Personal Info & Real Email OTP**: First Name, Last Name, Email with live Supabase email OTP authentication, OTP entry field, 60-second cooldown resend timer, Indian phone number (+91), password & confirm password with live requirements validation and strength meter (Weak / Medium / Strong).
   - **Step 2: Farm Information & Location**: Farm Name, **LocationPicker** supporting both on-demand browser GPS detection + reverse geocoding to City/State, and interactive **Leaflet + OpenStreetMap** interactive pin-drop map with search. Farm Area with Acre/Hectare unit selector. Searchable primary crops multi-select chips with custom "Other" crop input.
   - **Step 3: Selling Profile & Review Summary**: Primary selling categories (Grains, Vegetables, Fruits, Pulses, Oilseeds, Spices, Cash Crops, Other), typical selling quantity, preferred selling unit (kg, quintal, tonne), review summary with edit shortcuts, and complete registration submission.
   - Normalizes data into Supabase `profiles`, `farmer_profiles`, and `farmer_crops` tables with Row Level Security (RLS).
   - Post-registration **SuccessScreen** routing to `/farmer/dashboard` or `/profile`.

3. **Buyer Multi-Step Registration (`/register/buyer`)**:
   - **Step 1**: Personal Info, real Supabase Email OTP verification, phone number, and password validation.
   - **Step 2**: Company Name, Business Type dropdown (Wholesaler, Retailer, Supermarket, Food Processor, Distributor, Exporter, Restaurant, Institutional Buyer, E-commerce, Agricultural Trader, Other + custom input), operating City, 15-character Indian GSTIN validation (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`), and Business Address.
   - **Step 3**: Review business summary and complete registration.
   - Normalizes data into Supabase `profiles` and `buyer_profiles` tables with RLS.
   - Post-registration **SuccessScreen** routing to `/buyer/dashboard` or `/marketplace`.

4. **Unified Sign In (`/login`) & Forgot Password (`/forgot-password`)**:
   - Single unified login for both farmers and buyers (no manual role radio button).
   - Automatic role resolution after authentication:
     - Farmer → `/farmer/dashboard`
     - Buyer → `/buyer/dashboard`
     - Admin → `/admin/dashboard`
   - Real Supabase password reset workflow.
   - Dynamic Navbar auth states: displays user profile icon, role-based Dashboard button, and Logout when authenticated.

5. **Real GPS Weather Telemetry via Open-Meteo (Zero Fake Data)**:
   - Removed all dummy/invented weather numbers.
   - Initial clean prompt card: *"Weather Near You"* with *"Use My Location"* GPS button.
   - Live meteorological satellite telemetry powered by **Open-Meteo** (open, public, keyless API).
   - Reverse geocoding via OpenStreetMap Nominatim.
   - 5-day agro-meteorological forecast, humidity, wind speed, rain probability, and WMO advisory code mapping.
   - Autocomplete city search fallback if GPS permission is denied.
   - 20-minute client cache (`localStorage`) to prevent duplicate requests.

6. **Full Application-Wide Multilingual System (i18n)**:
   - Configured with `i18next` and `react-i18next`.
   - Complete localized translations across:
     - English (`en`)
     - Hindi (`hi`)
     - Gujarati (`gu`)
   - Translates Navbar, Hero, Feature highlights, Weather labels, Market labels, How it Works, Why Choose, CTA cards, Decision support, Trust section, Footer, Registration flows, Login, and Success screens.
   - Language choice persisted in `localStorage` under `agrinova_language`.

7. **Component-Based Social Links**:
   - Replaced text/emoji placeholders with proper `react-icons` SVG components (`FaXTwitter`, `FaLinkedinIn`, `FaFacebookF`, `FaInstagram`, `FaYoutube`).
   - Centralized configuration in `client/src/constants/socialLinks.js`.

8. **Market Price Preview Transparency**:
   - Explicitly labeled as *"Market Price Preview (Sample APMC Benchmarks)"* to ensure complete transparency until real-time mandi API sync is connected in Phase 3.

---

## Architecture Overview

```
AgriNova/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # EmailOtpVerification, RoleSelectionCard, RegistrationProgress, RegistrationLayout, SuccessScreen
│   │   │   ├── common/         # TextInput, PasswordInput, PasswordStrength, PhoneInput, LocationPicker, CropMultiSelect, Button, Card, SocialLink, ProtectedRoute, RoleRoute
│   │   │   ├── layout/         # Dynamic Navbar (Auth & i18n), Footer
│   │   │   ├── home/           # HeroSection, WeatherMarketSection, HowItWorks, WhyChoose, FarmerBuyerCTA, DecisionSupport, Trust
│   │   │   ├── weather/        # WeatherDashboard (Open-Meteo Live GPS & Search)
│   │   │   └── marketplace/    # MarketPrices (Sample APMC Benchmarks)
│   │   ├── context/            # AuthContext.jsx, LanguageContext.jsx
│   │   ├── hooks/              # useWeather.js, useMarketPrices.js, useGeolocation.js
│   │   ├── locales/            # en/, hi/, gu/ (common.json, home.json, auth.json)
│   │   ├── pages/              # HomePage, RegisterRolePage, FarmerRegisterPage, BuyerRegisterPage, LoginPage, ForgotPasswordPage, PlaceholderPage
│   │   ├── routes/             # AppRoutes.jsx
│   │   ├── services/           # weatherService.js, marketService.js, authService.js, api.js
│   │   ├── i18n.js             # i18next configuration
│   │   └── styles/
│   ├── .env.example
│   └── package.json
├── server/
│   ├── config/                 # env.js, supabase.js
│   ├── sql/
│   │   └── schema.sql          # Complete Supabase PostgreSQL schema with RLS
│   ├── .env.example
│   └── package.json
└── package.json
```

---

## Supabase PostgreSQL Setup & Migration

Run the SQL script located at `server/sql/schema.sql` in your Supabase SQL Editor:
1. Navigates to **Supabase Dashboard → SQL Editor**.
2. Paste the contents of `server/sql/schema.sql` and click **Run**.
3. It creates:
   - `public.profiles` (Linked to `auth.users`)
   - `public.farmer_profiles`
   - `public.farmer_crops`
   - `public.buyer_profiles`
   - `public.market_prices`
   - Row Level Security (RLS) policies ensuring users can only edit their own profile while public marketplace listings remain viewable.

### Custom SMTP Email Verification OTP Flow (Nodemailer + Gmail SMTP)

AgriNova now features a dedicated, secure server-side SMTP email verification system:
- **Zero Frontend Leakage**: SMTP credentials (`EMAIL_USER`, `EMAIL_PASS`) reside exclusively on the Express backend environment (`server/.env`). Vite/React never touches or exposes email credentials.
- **Gmail SMTP (Port 587)**: Configured using a secure 16-character Google App Password with automated TLS and certificate verification.
- **Cryptographic Security**: Six-digit OTPs are generated using Node's `crypto.randomInt` and hashed with SHA-256 before storage. Raw OTPs are never permanently stored and never returned in API responses.
- **Abuse Prevention**: 
  - 60-second resend cooldown enforced on both frontend and backend.
  - 10-minute expiration window.
  - 5-attempt limit with automatic OTP invalidation on brute force.
  - Rate limiting on `/api/auth/send-email-otp` and `/api/auth/verify-email-otp` via `express-rate-limit`.
- **Responsive Email Template**: AgriNova-branded Modern Agri-Tech email featuring emerald/dark-navy accents, preheader snippet, centered OTP display box, security warnings, and plain-text fallback.
- **Server Gatekeeping**: Both `/api/auth/register/farmer` and `/api/auth/register/buyer` strictly verify email verification status before permitting registration.

#### SMTP Environment Configuration (`server/.env`):
```env
PORT=5000
CLIENT_URL=http://localhost:5173

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

> **Note on Gmail App Passwords**: Do NOT use your standard Google password. Go to **Google Account → Security → 2-Step Verification → App Passwords**, generate a password for "Mail" / "AgriNova", and paste the 16-character code into `EMAIL_PASS`.

---

## Running Locally

1. **Client (Vite)**:
   ```powershell
   cd client
   npm run dev
   ```
   Accessible at `http://localhost:5173`

2. **Server (Express)**:
   ```powershell
   cd server
   npm run dev
   ```
   Accessible at `http://localhost:5000`
