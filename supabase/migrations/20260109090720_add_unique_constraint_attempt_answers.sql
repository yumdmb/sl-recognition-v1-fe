-- Migration: Add unique constraint to prevent duplicate answers per question in test attempts
-- Rollback: ALTER TABLE public.proficiency_test_attempt_answers DROP CONSTRAINT IF EXISTS unique_attempt_question;

-- First, clean up any existing duplicates (keep the most recent answer per question)
DELETE FROM public.proficiency_test_attempt_answers a
WHERE a.id NOT IN (
    SELECT DISTINCT ON (attempt_id, question_id) id
    FROM public.proficiency_test_attempt_answers
    ORDER BY attempt_id, question_id, created_at DESC
);

-- Add unique constraint to prevent duplicate answers
ALTER TABLE public.proficiency_test_attempt_answers 
ADD CONSTRAINT unique_attempt_question 
UNIQUE (attempt_id, question_id);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT unique_attempt_question ON public.proficiency_test_attempt_answers IS 
'Ensures each question can only be answered once per test attempt, preventing duplicate submissions and score calculation errors';
