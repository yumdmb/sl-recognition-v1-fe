-- Migration: Add language column to proficiency_tests table
-- This allows tests to be categorized by sign language (ASL or MSL)
-- Rollback: ALTER TABLE public.proficiency_tests DROP COLUMN IF EXISTS language;

-- Add language column with constraint
ALTER TABLE public.proficiency_tests 
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'MSL'
CHECK (language IN ('ASL', 'MSL'));

-- Add comment to explain the column
COMMENT ON COLUMN public.proficiency_tests.language IS 'Sign language type: ASL (American Sign Language) or MSL (Malaysian Sign Language)';

-- Update existing tests to have MSL as default (can be changed later)
UPDATE public.proficiency_tests 
SET language = 'MSL' 
WHERE language IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_proficiency_tests_language 
ON public.proficiency_tests(language);
