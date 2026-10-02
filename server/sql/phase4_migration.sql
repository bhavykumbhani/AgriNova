-- ====================================================================
-- AgriNova Phase 4 Database Migration
-- Products, Orders, Realtime Messaging, Saved Products, Notifications
-- ====================================================================

-- 1. Helper function for unique human-readable order numbers (e.g. AGN-2026-000123)
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

-- 2. Products Table
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

-- 3. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
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

-- 5. Saved Products Table (Buyer Wishlist)
CREATE TABLE IF NOT EXISTS public.saved_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_profile_id UUID REFERENCES public.buyer_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_profile_id, product_id)
);

-- 6. Conversations Table
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

-- 7. Messages Table
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

-- 8. Notifications Table
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

-- ====================================================================
-- Performance Indexes
-- ====================================================================
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

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
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
