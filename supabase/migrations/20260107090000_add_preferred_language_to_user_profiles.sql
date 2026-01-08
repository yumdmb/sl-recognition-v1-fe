-- Migration: Add preferred_language column to user_profiles
-- This allows users to select their preferred sign language (ASL or MSL)
-- Rollback: ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS preferred_language;

-- Add preferred_language column with constraint
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT 
CHECK (preferred_language IN ('ASL', 'MSL'));

-- Add comment to explain the column
COMMENT ON COLUMN public.user_profiles.preferred_language IS 'User preferred sign language: ASL (American Sign Language) or MSL (Malaysian Sign Language)';

-- Create index for better query performance when filtering by language
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferred_language 
ON public.user_profiles(preferred_language);
