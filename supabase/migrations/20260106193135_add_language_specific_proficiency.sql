-- Migration: Add language-specific proficiency columns
-- This allows users to have separate proficiency levels for ASL and MSL
-- Rollback: 
--   ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS asl_proficiency_level;
--   ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS msl_proficiency_level;

-- Add ASL proficiency level column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS asl_proficiency_level TEXT 
CHECK (asl_proficiency_level IN ('Beginner', 'Intermediate', 'Advanced'));

-- Add MSL proficiency level column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS msl_proficiency_level TEXT 
CHECK (msl_proficiency_level IN ('Beginner', 'Intermediate', 'Advanced'));

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_profiles_asl_proficiency 
ON public.user_profiles(asl_proficiency_level);

CREATE INDEX IF NOT EXISTS idx_user_profiles_msl_proficiency 
ON public.user_profiles(msl_proficiency_level);

-- Migrate existing data based on preferred_language
-- If user already has a proficiency_level and preferred_language set, 
-- copy it to the appropriate language-specific column
UPDATE public.user_profiles 
SET asl_proficiency_level = proficiency_level::TEXT
WHERE preferred_language = 'ASL' 
  AND proficiency_level IS NOT NULL 
  AND asl_proficiency_level IS NULL;

UPDATE public.user_profiles 
SET msl_proficiency_level = proficiency_level::TEXT
WHERE preferred_language = 'MSL' 
  AND proficiency_level IS NOT NULL 
  AND msl_proficiency_level IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.asl_proficiency_level IS 'User proficiency level for American Sign Language (ASL)';
COMMENT ON COLUMN public.user_profiles.msl_proficiency_level IS 'User proficiency level for Malaysian Sign Language (MSL/BIM)';
