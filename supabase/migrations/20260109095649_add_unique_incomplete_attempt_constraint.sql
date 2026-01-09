-- Migration: Add partial unique constraint to prevent duplicate incomplete attempts
-- Rollback: DROP INDEX IF EXISTS unique_incomplete_attempt_per_user_test;
-- Description: Uses a partial unique index to ensure only one incomplete attempt exists per user+test

-- First, clean up any remaining duplicate incomplete attempts (keep most recent)
DELETE FROM public.proficiency_test_attempts a
WHERE a.completed_at IS NULL
  AND a.id NOT IN (
    SELECT DISTINCT ON (user_id, test_id) id
    FROM public.proficiency_test_attempts
    WHERE completed_at IS NULL
    ORDER BY user_id, test_id, created_at DESC
  );

-- Create a partial unique index
-- This allows multiple COMPLETED attempts (completed_at IS NOT NULL)
-- But only ONE incomplete attempt (completed_at IS NULL) per user+test
CREATE UNIQUE INDEX IF NOT EXISTS unique_incomplete_attempt_per_user_test
ON public.proficiency_test_attempts (user_id, test_id)
WHERE completed_at IS NULL;

-- Add comment explaining the constraint
COMMENT ON INDEX unique_incomplete_attempt_per_user_test IS 
'Ensures only one incomplete attempt exists per user+test combination. Completed attempts are not affected.';
