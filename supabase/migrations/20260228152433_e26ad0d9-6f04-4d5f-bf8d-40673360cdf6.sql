
-- ============================================
-- PHASE 1: ENUMS AND HELPER TYPES
-- ============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'tecnico', 'supervisor', 'administrativo');
CREATE TYPE public.prospect_status AS ENUM ('nuevo', 'contactado', 'convertido');
CREATE TYPE public.work_order_status AS ENUM ('pendiente', 'en_progreso', 'completada', 'cancelada');
CREATE TYPE public.client_status AS ENUM ('activo', 'pendiente', 'inactivo');

-- ============================================
-- PHASE 2: CORE TABLES
-- ============================================

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles (separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'tecnico',
  UNIQUE (user_id, role)
);

-- Config: Species Categories
CREATE TABLE public.species_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Config: Species
CREATE TABLE public.species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.species_categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, category_id)
);

-- Config: Supply Types
CREATE TABLE public.supply_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Config: Supplies/Insumos
CREATE TABLE public.supplies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type_id UUID NOT NULL REFERENCES public.supply_types(id) ON DELETE RESTRICT,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'unidad',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Config: Action Programs
CREATE TABLE public.action_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cuit TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  geo_lat DOUBLE PRECISION,
  geo_lng DOUBLE PRECISION,
  status public.client_status NOT NULL DEFAULT 'activo',
  plan TEXT DEFAULT 'Estándar',
  type TEXT,
  zone TEXT,
  contact_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Client Sites
CREATE TABLE public.client_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  address TEXT,
  geo_lat DOUBLE PRECISION,
  geo_lng DOUBLE PRECISION,
  contact_name TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prospects / Leads
CREATE TABLE public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  name TEXT,
  original_message TEXT,
  source TEXT DEFAULT 'whatsapp',
  status public.prospect_status NOT NULL DEFAULT 'nuevo',
  marketing_tags TEXT[] DEFAULT '{}',
  converted_client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Work Orders / OT
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  site_id UUID REFERENCES public.client_sites(id) ON DELETE SET NULL,
  program_id UUID REFERENCES public.action_programs(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  species JSONB DEFAULT '[]',
  scheduled_date TIMESTAMPTZ,
  flexible_schedule BOOLEAN NOT NULL DEFAULT false,
  status public.work_order_status NOT NULL DEFAULT 'pendiente',
  notes TEXT,
  checklist JSONB DEFAULT '[]',
  signature_url TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Work Order Supplies Used
CREATE TABLE public.work_order_supplies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  supply_id UUID NOT NULL REFERENCES public.supplies(id) ON DELETE RESTRICT,
  quantity NUMERIC NOT NULL DEFAULT 0,
  dosage TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Work Order Photos
CREATE TABLE public.work_order_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pdf_url TEXT
);

-- ============================================
-- PHASE 3: INDEXES
-- ============================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_species_category ON public.species(category_id);
CREATE INDEX idx_supplies_type ON public.supplies(type_id);
CREATE INDEX idx_client_sites_client ON public.client_sites(client_id);
CREATE INDEX idx_prospects_status ON public.prospects(status);
CREATE INDEX idx_work_orders_technician ON public.work_orders(technician_id);
CREATE INDEX idx_work_orders_client ON public.work_orders(client_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_wo_supplies_wo ON public.work_order_supplies(work_order_id);
CREATE INDEX idx_wo_photos_wo ON public.work_order_photos(work_order_id);
CREATE INDEX idx_certificates_wo ON public.certificates(work_order_id);

-- ============================================
-- PHASE 4: SECURITY DEFINER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_supervisor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'supervisor')
$$;

CREATE OR REPLACE FUNCTION public.is_technician()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'tecnico')
$$;

-- Check if technician owns a work order
CREATE OR REPLACE FUNCTION public.owns_work_order(_user_id UUID, _wo_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.work_orders
    WHERE id = _wo_id AND technician_id = _user_id
  )
$$;

-- ============================================
-- PHASE 5: TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_supplies_updated_at BEFORE UPDATE ON public.supplies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_prospects_updated_at BEFORE UPDATE ON public.prospects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PHASE 6: ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PHASE 7: RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated USING (public.is_admin());

-- USER ROLES
CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_roles_insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "user_roles_update" ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "user_roles_delete" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin());

-- CLIENTS
CREATE POLICY "clients_select" ON public.clients FOR SELECT TO authenticated USING (public.is_admin() OR public.is_supervisor());
CREATE POLICY "clients_insert" ON public.clients FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "clients_update" ON public.clients FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "clients_delete" ON public.clients FOR DELETE TO authenticated USING (public.is_admin());

-- CLIENT SITES
CREATE POLICY "client_sites_select" ON public.client_sites FOR SELECT TO authenticated USING (true);
CREATE POLICY "client_sites_insert" ON public.client_sites FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "client_sites_update" ON public.client_sites FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "client_sites_delete" ON public.client_sites FOR DELETE TO authenticated USING (public.is_admin());

-- PROSPECTS
CREATE POLICY "prospects_select" ON public.prospects FOR SELECT TO authenticated USING (public.is_admin() OR public.is_supervisor());
CREATE POLICY "prospects_insert" ON public.prospects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "prospects_update" ON public.prospects FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "prospects_delete" ON public.prospects FOR DELETE TO authenticated USING (public.is_admin());

-- CONFIG TABLES: read all, write admin only
-- Action Programs
CREATE POLICY "action_programs_select" ON public.action_programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "action_programs_insert" ON public.action_programs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "action_programs_update" ON public.action_programs FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "action_programs_delete" ON public.action_programs FOR DELETE TO authenticated USING (public.is_admin());

-- Species Categories
CREATE POLICY "species_categories_select" ON public.species_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "species_categories_insert" ON public.species_categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "species_categories_update" ON public.species_categories FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "species_categories_delete" ON public.species_categories FOR DELETE TO authenticated USING (public.is_admin());

-- Species
CREATE POLICY "species_select" ON public.species FOR SELECT TO authenticated USING (true);
CREATE POLICY "species_insert" ON public.species FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "species_update" ON public.species FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "species_delete" ON public.species FOR DELETE TO authenticated USING (public.is_admin());

-- Supply Types
CREATE POLICY "supply_types_select" ON public.supply_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "supply_types_insert" ON public.supply_types FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "supply_types_update" ON public.supply_types FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "supply_types_delete" ON public.supply_types FOR DELETE TO authenticated USING (public.is_admin());

-- Supplies
CREATE POLICY "supplies_select" ON public.supplies FOR SELECT TO authenticated USING (true);
CREATE POLICY "supplies_insert" ON public.supplies FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "supplies_update" ON public.supplies FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "supplies_delete" ON public.supplies FOR DELETE TO authenticated USING (public.is_admin());

-- WORK ORDERS
CREATE POLICY "work_orders_select" ON public.work_orders FOR SELECT TO authenticated
  USING (public.is_admin() OR public.is_supervisor() OR (public.is_technician() AND technician_id = auth.uid()));
CREATE POLICY "work_orders_insert" ON public.work_orders FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "work_orders_update" ON public.work_orders FOR UPDATE TO authenticated
  USING (public.is_admin() OR (public.is_technician() AND technician_id = auth.uid()));
CREATE POLICY "work_orders_delete" ON public.work_orders FOR DELETE TO authenticated USING (public.is_admin());

-- WORK ORDER SUPPLIES
CREATE POLICY "wo_supplies_select" ON public.work_order_supplies FOR SELECT TO authenticated
  USING (public.is_admin() OR public.is_supervisor() OR public.owns_work_order(auth.uid(), work_order_id));
CREATE POLICY "wo_supplies_insert" ON public.work_order_supplies FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.owns_work_order(auth.uid(), work_order_id));
CREATE POLICY "wo_supplies_update" ON public.work_order_supplies FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.owns_work_order(auth.uid(), work_order_id));
CREATE POLICY "wo_supplies_delete" ON public.work_order_supplies FOR DELETE TO authenticated USING (public.is_admin());

-- WORK ORDER PHOTOS
CREATE POLICY "wo_photos_select" ON public.work_order_photos FOR SELECT TO authenticated
  USING (public.is_admin() OR public.is_supervisor() OR public.owns_work_order(auth.uid(), work_order_id));
CREATE POLICY "wo_photos_insert" ON public.work_order_photos FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.owns_work_order(auth.uid(), work_order_id));
CREATE POLICY "wo_photos_delete" ON public.work_order_photos FOR DELETE TO authenticated USING (public.is_admin());

-- CERTIFICATES
CREATE POLICY "certificates_select" ON public.certificates FOR SELECT TO authenticated
  USING (public.is_admin() OR public.is_supervisor() OR public.owns_work_order(auth.uid(), work_order_id));
CREATE POLICY "certificates_insert" ON public.certificates FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "certificates_update" ON public.certificates FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "certificates_delete" ON public.certificates FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================
-- PHASE 8: SEED CONFIG DATA
-- ============================================

INSERT INTO public.species_categories (name) VALUES
  ('Insecto Rastrero'), ('Insecto Volador'), ('Aves'), ('Roedores'), ('Arácnidos'), ('Animales Domésticos');

INSERT INTO public.supply_types (name) VALUES
  ('Gel'), ('Bloque'), ('Polvo'), ('Plaguicida Líquido'), ('Lure'), ('EPP'), ('Placa Adhesiva');

INSERT INTO public.action_programs (name, description) VALUES
  ('Desinsectación', 'Control integral de insectos rastreros y voladores'),
  ('Desratización', 'Control de roedores con métodos mecánicos y químicos'),
  ('MIP Integral', 'Manejo Integrado de Plagas - programa completo'),
  ('Fumigación', 'Tratamiento de choque con nebulización'),
  ('Sanitización', 'Desinfección y sanitización de ambientes');
