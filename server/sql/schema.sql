-- ====================================================================
-- AgriNova PostgreSQL Database Schema (Supabase)
-- Smart Agriculture Marketplace and Decision Support System
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Core User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  preferred_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Farmer Profiles Table
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  farm_name VARCHAR(200) NOT NULL,
  farm_area NUMERIC(8, 2),
  farm_area_unit VARCHAR(20) DEFAULT 'Acre' CHECK (farm_area_unit IN ('Acre', 'Hectare')),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  formatted_address TEXT,
  selling_categories TEXT[], -- e.g. ['Grains', 'Vegetables']
  typical_quantity NUMERIC(10, 2),
  preferred_selling_unit VARCHAR(20) DEFAULT 'quintal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Farmer Primary Crops Table (Normalized)
CREATE TABLE IF NOT EXISTS public.farmer_crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_profile_id UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Buyer Profiles Table
CREATE TABLE IF NOT EXISTS public.buyer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  gstin VARCHAR(20),
  business_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Standard Crops Directory
CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  hindi_name VARCHAR(100),
  category VARCHAR(50) NOT NULL,
  standard_unit VARCHAR(20) DEFAULT 'quintal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Market Prices Reference Table
CREATE TABLE IF NOT EXISTS public.market_prices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  hindi_name VARCHAR(100),
  price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'quintal',
  change_amount NUMERIC(8, 2) DEFAULT 0.00,
  change_percent NUMERIC(5, 2) DEFAULT 0.00,
  is_positive BOOLEAN DEFAULT TRUE,
  mandi VARCHAR(150) NOT NULL,
  variety VARCHAR(100),
  sparkline NUMERIC[] DEFAULT '{}',
  icon_type VARCHAR(50),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SMTP Email Verification OTPs Table (Temporary & Hashed)
CREATE TABLE IF NOT EXISTS public.email_verification_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempt_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_profile ON public.farmer_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_farmer_crops_farmer ON public.farmer_crops(farmer_profile_id);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_profile ON public.buyer_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_email_otps_lookup ON public.email_verification_otps(email, verified, expires_at);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_otps ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can read their own profile, public can read verified info
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- 2. Farmer Profiles
CREATE POLICY "Farmers can manage own farmer profile"
  ON public.farmer_profiles FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Public can view farmer profiles for marketplace"
  ON public.farmer_profiles FOR SELECT
  USING (true);

-- 3. Farmer Crops
CREATE POLICY "Farmers can manage own crops"
  ON public.farmer_crops FOR ALL
  USING (farmer_profile_id IN (
    SELECT fp.id FROM public.farmer_profiles fp
    JOIN public.profiles p ON fp.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  ));

CREATE POLICY "Public can view farmer crops"
  ON public.farmer_crops FOR SELECT
  USING (true);

-- 4. Buyer Profiles
CREATE POLICY "Buyers can manage own buyer profile"
  ON public.buyer_profiles FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Public can view buyer profiles"
  ON public.buyer_profiles FOR SELECT
  USING (true);

-- 5. Market Prices: Public read-only
CREATE POLICY "Public can read market prices"
  ON public.market_prices FOR SELECT
  USING (true);

-- 6. Email Verification OTPs: Backend service role only
CREATE POLICY "Service role manages verification OTPs"
  ON public.email_verification_otps FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ====================================================================
-- 7. Contact & Support Messages Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  topic VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages(created_at);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages contact messages"
  ON public.contact_messages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
