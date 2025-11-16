-- Migration: Add recommended_for_role field to content tables
-- Rollback: ALTER TABLE public.tutorials DROP COLUMN IF EXISTS recommended_for_role;
--           ALTER TABLE public.quiz_sets DROP COLUMN IF EXISTS recommended_for_role;
--           ALTER TABLE public.materials DROP COLUMN IF EXISTS recommended_for_role;

-- Add recommended_for_role column to tutorials table
ALTER TABLE public.tutorials 
ADD COLUMN IF NOT EXISTS recommended_for_role TEXT DEFAULT 'all' 
CHECK (recommended_for_role IN ('deaf', 'non-deaf', 'all'));

-- Add recommended_for_role column to quiz_sets table
ALTER TABLE public.quiz_sets 
ADD COLUMN IF NOT EXISTS recommended_for_role TEXT DEFAULT 'all' 
CHECK (recommended_for_role IN ('deaf', 'non-deaf', 'all'));

-- Add recommended_for_role column to materials table
ALTER TABLE public.materials 
ADD COLUMN IF NOT EXISTS recommended_for_role TEXT DEFAULT 'all' 
CHECK (recommended_for_role IN ('deaf', 'non-deaf', 'all'));

-- Add comments
COMMENT ON COLUMN public.tutorials.recommended_for_role IS 'Target audience: deaf (visual learning), non-deaf (comparative learning), or all (universal content)';
COMMENT ON COLUMN public.quiz_sets.recommended_for_role IS 'Target audience: deaf (visual learning), non-deaf (comparative learning), or all (universal content)';
COMMENT ON COLUMN public.materials.recommended_for_role IS 'Target audience: deaf (visual learning), non-deaf (comparative learning), or all (universal content)';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tutorials_recommended_for_role ON public.tutorials(recommended_for_role);
CREATE INDEX IF NOT EXISTS idx_quiz_sets_recommended_for_role ON public.quiz_sets(recommended_for_role);
CREATE INDEX IF NOT EXISTS idx_materials_recommended_for_role ON public.materials(recommended_for_role);
