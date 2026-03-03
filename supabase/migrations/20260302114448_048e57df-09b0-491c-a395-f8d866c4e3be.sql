
-- Company info (single-row settings table)
CREATE TABLE public.company_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social text NOT NULL DEFAULT '',
  cuit text,
  address text,
  phone text,
  email text,
  owner_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company_info_select" ON public.company_info FOR SELECT USING (true);
CREATE POLICY "company_info_insert" ON public.company_info FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "company_info_update" ON public.company_info FOR UPDATE USING (is_admin());
CREATE POLICY "company_info_delete" ON public.company_info FOR DELETE USING (is_admin());

-- Legal representative (single-row settings table)
CREATE TABLE public.legal_representative (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  dni text,
  position text,
  signature_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.legal_representative ENABLE ROW LEVEL SECURITY;
CREATE POLICY "legal_rep_select" ON public.legal_representative FOR SELECT USING (true);
CREATE POLICY "legal_rep_insert" ON public.legal_representative FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "legal_rep_update" ON public.legal_representative FOR UPDATE USING (is_admin());
CREATE POLICY "legal_rep_delete" ON public.legal_representative FOR DELETE USING (is_admin());
