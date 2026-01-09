-- Migration: Recalculate proficiency test scores > 100%
-- Rollback: N/A (data correction)
-- Description: Recalculates scores for attempts where the score is greater than 100%, based on the actual answers (which have been deduplicated)

-- Update attempts with invalid scores (> 100)
-- Recalculate based on: (correct answers / total questions) * 100
UPDATE public.proficiency_test_attempts pta
SET score = (
    SELECT ROUND(
        (
            -- Count correct answers for this attempt
            (SELECT COUNT(*) FROM public.proficiency_test_attempt_answers ptaa 
             WHERE ptaa.attempt_id = pta.id AND ptaa.is_correct = true)::numeric 
            / 
            -- Count total questions for the test
            NULLIF((SELECT COUNT(*) FROM public.proficiency_test_questions ptq 
             WHERE ptq.test_id = pta.test_id), 0)::numeric
        ) * 100
    )
)
WHERE pta.score > 100;

-- Optional: Also clean up any scores that might be null but should be 0 if the test is marked complete
-- (This is just a safety measure, removing if unexpected)

-- Add comment
COMMENT ON TABLE public.proficiency_test_attempts IS 
'Test attempts table. Data integrity check applied on 2026-01-09 to fix >100% scores.';
