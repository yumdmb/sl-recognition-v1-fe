-- Migration: Clean up duplicate incomplete test attempts
-- Rollback: N/A (data cleanup only, cannot be reversed)
-- Description: Removes duplicate incomplete attempts, keeping only the most recent one per user+test combination

-- Delete duplicate incomplete attempts, keeping the most recent one per user+test
-- This cleans up existing data caused by the bug where page refreshes created new attempts
DELETE FROM public.proficiency_test_attempts a
WHERE a.completed_at IS NULL  -- Only target incomplete attempts
  AND a.id NOT IN (
    -- Keep the most recent incomplete attempt per user+test combination
    SELECT DISTINCT ON (user_id, test_id) id
    FROM public.proficiency_test_attempts
    WHERE completed_at IS NULL
    ORDER BY user_id, test_id, created_at DESC
  );

-- Also delete orphaned answers (answers for attempts that were deleted)
-- Note: This should be handled by CASCADE, but being explicit
DELETE FROM public.proficiency_test_attempt_answers
WHERE attempt_id NOT IN (
    SELECT id FROM public.proficiency_test_attempts
);

-- Add comment explaining the cleanup
COMMENT ON TABLE public.proficiency_test_attempts IS 
'Test attempts table. Note: createTestAttempt now reuses incomplete attempts to prevent duplicates.';
