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
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_otps ENABLE ROW LEVEL SECURITY;

-- 0. Standard Crops: Public read-only
CREATE POLICY "Public can view standard crops directory"
  ON public.crops FOR SELECT
  USING (true);

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

-- ====================================================================
-- 8. PHASE 4 TABLES: Products, Orders, Messaging, Saved Products, Notifications
-- ====================================================================

-- Sequence & trigger for human-readable order numbers (e.g. AGN-2026-000123)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'AGN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_profile_id UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  crop_name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  quantity_available NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  quantity_unit VARCHAR(30) NOT NULL DEFAULT 'quintal',
  price_per_quintal NUMERIC(12, 2) NOT NULL CHECK (price_per_quintal > 0),
  harvest_date DATE,
  available_from DATE,
  quality_grade VARCHAR(50) DEFAULT 'Standard',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  city VARCHAR(100),
  state VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Draft', 'Active', 'Sold Out', 'Inactive', 'Archived')),
  primary_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  farmer_profile_id UUID REFERENCES public.farmer_profiles(id) ON DELETE RESTRICT NOT NULL,
  buyer_profile_id UUID REFERENCES public.buyer_profiles(id) ON DELETE RESTRICT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
  quantity_unit VARCHAR(30) NOT NULL DEFAULT 'quintal',
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price > 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Confirmed', 'Processing', 'Shipped', 'Completed', 'Cancelled')),
  delivery_method VARCHAR(50) DEFAULT 'Farmer Delivery',
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS trg_generate_order_number ON public.orders;
CREATE TRIGGER trg_generate_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Saved Products Table (Buyer Wishlist)
CREATE TABLE IF NOT EXISTS public.saved_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_profile_id UUID REFERENCES public.buyer_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_profile_id, product_id)
);

-- Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_profile_id UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_profile_id UUID REFERENCES public.buyer_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(farmer_profile_id, buyer_profile_id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'offer', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('order', 'message', 'product', 'system')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_farmer ON public.products(farmer_profile_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_farmer ON public.orders(farmer_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_buyer ON public.saved_products(buyer_profile_id);
CREATE INDEX IF NOT EXISTS idx_conv_farmer ON public.conversations(farmer_profile_id);
CREATE INDEX IF NOT EXISTS idx_conv_buyer ON public.conversations(buyer_profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_notif_profile ON public.notifications(profile_id, read_at);

-- RLS Enforcement
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Products RLS
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (status = 'Active' AND deleted_at IS NULL);

CREATE POLICY "Farmers can manage own products"
  ON public.products FOR ALL
  USING (
    farmer_profile_id IN (
      SELECT fp.id FROM public.farmer_profiles fp
      JOIN public.profiles p ON fp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Product Images RLS
CREATE POLICY "Public can view product images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Farmers can manage own product images"
  ON public.product_images FOR ALL
  USING (
    product_id IN (
      SELECT pr.id FROM public.products pr
      JOIN public.farmer_profiles fp ON pr.farmer_profile_id = fp.id
      JOIN public.profiles p ON fp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Orders RLS
CREATE POLICY "Farmers and buyers can view own orders"
  ON public.orders FOR SELECT
  USING (
    farmer_profile_id IN (
      SELECT fp.id FROM public.farmer_profiles fp
      JOIN public.profiles p ON fp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
    OR
    buyer_profile_id IN (
      SELECT bp.id FROM public.buyer_profiles bp
      JOIN public.profiles p ON bp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (
    buyer_profile_id IN (
      SELECT bp.id FROM public.buyer_profiles bp
      JOIN public.profiles p ON bp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Farmers and buyers can update own orders"
  ON public.orders FOR UPDATE
  USING (
    farmer_profile_id IN (
      SELECT fp.id FROM public.farmer_profiles fp
      JOIN public.profiles p ON fp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
    OR
    buyer_profile_id IN (
      SELECT bp.id FROM public.buyer_profiles bp
      JOIN public.profiles p ON bp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Saved Products RLS
CREATE POLICY "Buyers can manage saved products"
  ON public.saved_products FOR ALL
  USING (
    buyer_profile_id IN (
      SELECT bp.id FROM public.buyer_profiles bp
      JOIN public.profiles p ON bp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Conversations RLS
CREATE POLICY "Participants can view conversations"
  ON public.conversations FOR SELECT
  USING (
    farmer_profile_id IN (
      SELECT fp.id FROM public.farmer_profiles fp
      JOIN public.profiles p ON fp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
    OR
    buyer_profile_id IN (
      SELECT bp.id FROM public.buyer_profiles bp
      JOIN public.profiles p ON bp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    farmer_profile_id IN (
      SELECT fp.id FROM public.farmer_profiles fp
      JOIN public.profiles p ON fp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
    OR
    buyer_profile_id IN (
      SELECT bp.id FROM public.buyer_profiles bp
      JOIN public.profiles p ON bp.profile_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Messages RLS
CREATE POLICY "Conversation members can view messages"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.farmer_profiles fp ON c.farmer_profile_id = fp.id
      JOIN public.profiles pf ON fp.profile_id = pf.id
      WHERE pf.auth_user_id = auth.uid()
      UNION
      SELECT c.id FROM public.conversations c
      JOIN public.buyer_profiles bp ON c.buyer_profile_id = bp.id
      JOIN public.profiles pb ON bp.profile_id = pb.id
      WHERE pb.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Conversation members can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_profile_id IN (
      SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
    )
    AND
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.farmer_profiles fp ON c.farmer_profile_id = fp.id
      JOIN public.profiles pf ON fp.profile_id = pf.id
      WHERE pf.auth_user_id = auth.uid()
      UNION
      SELECT c.id FROM public.conversations c
      JOIN public.buyer_profiles bp ON c.buyer_profile_id = bp.id
      JOIN public.profiles pb ON bp.profile_id = pb.id
      WHERE pb.auth_user_id = auth.uid()
    )
  );

-- Notifications RLS
CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
    )
  );
