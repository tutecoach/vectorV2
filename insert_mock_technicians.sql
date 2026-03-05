-- Insert mock technicians into auth.users (simulate signup)
-- Note: We use raw inserts here for testing purposes. In production, users should be created via supabase.auth.admin.createUser

insert into auth.users (id, email, raw_user_meta_data, created_at, updated_at, role, aud, email_confirmed_at)
values 
  ('10000000-0000-0000-0000-000000000001', 'carlos.mendez@vector.com', '{"name": "Carlos Méndez"}', now(), now(), 'authenticated', 'authenticated', now()),
  ('10000000-0000-0000-0000-000000000002', 'ana.rios@vector.com', '{"name": "Ana Ríos"}', now(), now(), 'authenticated', 'authenticated', now()),
  ('10000000-0000-0000-0000-000000000003', 'luis.paredes@vector.com', '{"name": "Luis Paredes"}', now(), now(), 'authenticated', 'authenticated', now()),
  ('10000000-0000-0000-0000-000000000004', 'maria.garcia@vector.com', '{"name": "María García"}', now(), now(), 'authenticated', 'authenticated', now())
ON CONFLICT (id) DO NOTHING;

-- Insert their profiles
insert into public.profiles (id, user_id, name, updated_at)
values
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'Carlos Méndez', now()),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'Ana Ríos', now()),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'Luis Paredes', now()),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'María García', now())
ON CONFLICT (user_id) DO NOTHING;

-- Insert their roles as 'tecnico'
insert into public.user_roles (user_id, role)
values
  ('10000000-0000-0000-0000-000000000001', 'tecnico'),
  ('10000000-0000-0000-0000-000000000002', 'tecnico'),
  ('10000000-0000-0000-0000-000000000003', 'tecnico'),
  ('10000000-0000-0000-0000-000000000004', 'tecnico')
ON CONFLICT DO NOTHING;
