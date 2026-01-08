-- Migration: Add level column to quiz_sets table
-- Rollback: ALTER TABLE public.quiz_sets DROP COLUMN IF EXISTS level;

-- Add level column to quiz_sets table
ALTER TABLE public.quiz_sets 
ADD COLUMN IF NOT EXISTS level VARCHAR(20) DEFAULT 'beginner';

-- Add check constraint for valid level values
ALTER TABLE public.quiz_sets 
ADD CONSTRAINT quiz_sets_level_check 
CHECK (level IN ('beginner', 'intermediate', 'advanced'));

-- Add index for level column for performance
CREATE INDEX IF NOT EXISTS idx_quiz_sets_level ON public.quiz_sets(level);

-- Add comment for documentation
COMMENT ON COLUMN public.quiz_sets.level IS 'Difficulty level: beginner, intermediate, or advanced';
