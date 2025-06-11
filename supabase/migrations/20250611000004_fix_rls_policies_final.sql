-- Fix RLS policies by dropping existing ones and recreating them properly
-- This addresses the circular dependency issues and ensures proper RLS functionality

-- ==============================================
-- STEP 1: Enable RLS on all tables (safe if already enabled)
-- ==============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_progress ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 2: Drop ALL existing policies for user_profiles
-- ==============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage tutorials" ON public.user_profiles;
DROP POLICY IF EXISTS "Everyone can view tutorials" ON public.user_profiles;

-- ==============================================
-- STEP 3: Create new, simplified RLS policies
-- ==============================================

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (needed for registration)
CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Simplified admin access (avoid circular dependency)
-- This uses a direct subquery instead of EXISTS to prevent recursion
CREATE POLICY "Service role and admin access" ON public.user_profiles
  FOR ALL USING (
    auth.role() = 'service_role' 
    OR 
    auth.uid() IN (
      SELECT up.id 
      FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- ==============================================
-- STEP 4: Ensure user creation function works with RLS
-- ==============================================

-- Update the function to be SECURITY DEFINER (bypasses RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User'),
    COALESCE(NEW.email, 'unknown@example.com'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'non-deaf')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- STEP 5: Backfill missing user profiles
-- ==============================================

-- Insert profiles for any existing auth users that don't have them
INSERT INTO public.user_profiles (id, name, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', au.email, 'User'),
  COALESCE(au.email, 'unknown@example.com'),
  COALESCE(au.raw_user_meta_data->>'role', 'non-deaf')
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
AND au.id IS NOT NULL
ON CONFLICT (id) DO NOTHING;
