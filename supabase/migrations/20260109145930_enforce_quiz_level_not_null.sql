-- Migration: Make quiz_sets.level mandatory
-- Rollback: ALTER TABLE public.quiz_sets ALTER COLUMN level DROP NOT NULL;

-- 1. Ensure all existing quizzes have a default level (backfill)
UPDATE public.quiz_sets 
SET level = 'beginner' 
WHERE level IS NULL;

-- 2. Add NOT NULL constraint to enforce level requirement
ALTER TABLE public.quiz_sets 
ALTER COLUMN level SET NOT NULL;

-- 3. Ensure the check constraint exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_sets_level_check') THEN 
        ALTER TABLE public.quiz_sets 
        ADD CONSTRAINT quiz_sets_level_check 
        CHECK (level IN ('beginner', 'intermediate', 'advanced'));
    END IF; 
END $$;
