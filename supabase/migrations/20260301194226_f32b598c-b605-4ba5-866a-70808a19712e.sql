
-- Sucursales
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  cuit text,
  phone text,
  email text,
  province text,
  city text,
  address text,
  shift_start time DEFAULT '08:00',
  header_bg_color text DEFAULT '#33A867',
  header_text_color text DEFAULT '#FFFFFF',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "branches_select" ON public.branches FOR SELECT USING (true);
CREATE POLICY "branches_insert" ON public.branches FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "branches_update" ON public.branches FOR UPDATE USING (is_admin());
CREATE POLICY "branches_delete" ON public.branches FOR DELETE USING (is_admin());

-- Habilitaciones
CREATE TABLE public.certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jurisdiction text NOT NULL,
  name text NOT NULL,
  registration_number text,
  expiry_date date,
  pest_control boolean DEFAULT false,
  tank_cleaning boolean DEFAULT false,
  technical_director text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certifications_select" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "certifications_insert" ON public.certifications FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "certifications_update" ON public.certifications FOR UPDATE USING (is_admin());
CREATE POLICY "certifications_delete" ON public.certifications FOR DELETE USING (is_admin());

-- Motivos de Cancelación
CREATE TABLE public.cancellation_reasons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  chargeable boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cancellation_reasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cancellation_reasons_select" ON public.cancellation_reasons FOR SELECT USING (true);
CREATE POLICY "cancellation_reasons_insert" ON public.cancellation_reasons FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "cancellation_reasons_update" ON public.cancellation_reasons FOR UPDATE USING (is_admin());
CREATE POLICY "cancellation_reasons_delete" ON public.cancellation_reasons FOR DELETE USING (is_admin());

-- Rubros
CREATE TABLE public.business_sectors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.business_sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "business_sectors_select" ON public.business_sectors FOR SELECT USING (true);
CREATE POLICY "business_sectors_insert" ON public.business_sectors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "business_sectors_update" ON public.business_sectors FOR UPDATE USING (is_admin());
CREATE POLICY "business_sectors_delete" ON public.business_sectors FOR DELETE USING (is_admin());

-- Sectores de Instalaciones
CREATE TABLE public.facility_sectors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.facility_sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "facility_sectors_select" ON public.facility_sectors FOR SELECT USING (true);
CREATE POLICY "facility_sectors_insert" ON public.facility_sectors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "facility_sectors_update" ON public.facility_sectors FOR UPDATE USING (is_admin());
CREATE POLICY "facility_sectors_delete" ON public.facility_sectors FOR DELETE USING (is_admin());

-- Métodos de Aplicación
CREATE TABLE public.application_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.application_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "application_methods_select" ON public.application_methods FOR SELECT USING (true);
CREATE POLICY "application_methods_insert" ON public.application_methods FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "application_methods_update" ON public.application_methods FOR UPDATE USING (is_admin());
CREATE POLICY "application_methods_delete" ON public.application_methods FOR DELETE USING (is_admin());

-- Directores Técnicos
CREATE TABLE public.technical_directors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  title text,
  license_number text,
  license_expiry date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.technical_directors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "technical_directors_select" ON public.technical_directors FOR SELECT USING (true);
CREATE POLICY "technical_directors_insert" ON public.technical_directors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "technical_directors_update" ON public.technical_directors FOR UPDATE USING (is_admin());
CREATE POLICY "technical_directors_delete" ON public.technical_directors FOR DELETE USING (is_admin());
