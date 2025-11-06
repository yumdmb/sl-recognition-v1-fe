-- ============================================================================
-- SEED DATA FOR LOCAL DEVELOPMENT
-- ============================================================================
-- This file runs automatically on:
-- - supabase start
-- - supabase db reset
--
-- Configured in supabase/config.toml:
-- [db.seed]
-- enabled = true
-- sql_paths = ["./seed.sql"]
-- ============================================================================

-- ============================================================================
-- ADMIN USER SEED DATA
-- ============================================================================
-- Email: admin@sign-language.com
-- Password: test123
-- Role: admin
--
-- NOTE: To create this admin user, you need to:
-- 1. Start local Supabase: npx supabase start
-- 2. Sign up via your app or use Supabase Studio
-- 3. Then run this SQL to upgrade the user to admin
-- ============================================================================

-- Option 1: If you already created the user via signup, upgrade to admin
-- UPDATE public.user_profiles 
-- SET role = 'admin' 
-- WHERE email = 'admin@sign-language.com';

-- Option 2: Create admin user using Supabase Auth API (recommended)
-- You cannot directly insert into auth.users with plain passwords
-- Instead, use one of these methods:
--
-- Method A: Sign up via your Next.js app at /auth/register
-- Method B: Use Supabase Studio at http://127.0.0.1:54323
--   1. Go to Authentication > Users
--   2. Click "Add User"
--   3. Email: admin@sign-language.com
--   4. Password: test123
--   5. Then run the UPDATE above to set role to 'admin'
--
-- Method C: Use SQL to create with proper password hashing
-- This uses Supabase's internal password hashing (crypt extension)

-- Create admin user with properly hashed password
-- Password: test123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'admin@sign-language.com',
  crypt('test123', gen_salt('bf')), -- Proper bcrypt hashing
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User","role":"admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert admin user identity
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@sign-language.com","email_verified":true,"provider":"email"}',
  'email',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (provider_id, provider) DO NOTHING;

-- Ensure user profile has admin role
-- The trigger should create this automatically, but we ensure it's admin
INSERT INTO public.user_profiles (id, name, email, role, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Admin User',
  'admin@sign-language.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', name = 'Admin User';

-- ============================================================================
-- SAMPLE DATA (Optional - Uncomment if needed)
-- ============================================================================

-- Sample tutorials
-- INSERT INTO public.tutorials (title, description, video_url, duration, level, language, created_by)
-- VALUES
--   ('Basic Greetings', 'Learn basic ASL greetings', 'https://youtube.com/watch?v=example1', '10:30', 'beginner', 'ASL', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
--   ('Common Phrases', 'Essential MSL phrases', 'https://youtube.com/watch?v=example2', '15:45', 'beginner', 'MSL', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Sample materials
-- INSERT INTO public.materials (title, description, type, download_url, level, language, created_by)
-- VALUES
--   ('ASL Alphabet Guide', 'Complete guide to ASL alphabet', 'pdf', 'https://example.com/asl-alphabet.pdf', 'beginner', 'ASL', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
--   ('MSL Numbers', 'Learn numbers in MSL', 'pdf', 'https://example.com/msl-numbers.pdf', 'beginner', 'MSL', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Sample quiz sets
-- INSERT INTO public.quiz_sets (title, description, language, created_by)
-- VALUES
--   ('ASL Basics Quiz', 'Test your knowledge of basic ASL', 'ASL', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
--   ('MSL Fundamentals', 'Quiz on MSL fundamentals', 'MSL', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
