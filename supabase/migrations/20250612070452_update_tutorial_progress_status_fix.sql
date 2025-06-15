-- Update tutorial progress table to use status instead of percentage
-- Migration: Change tutorial progress system to simple start/completed status

-- Add status column to tutorial_progress table
ALTER TABLE public.tutorial_progress 
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('started', 'completed')) DEFAULT 'started';

-- Update existing records to use the new status system
-- If progress = 100, set status to 'completed', otherwise 'started'
UPDATE public.tutorial_progress 
SET status = CASE 
  WHEN progress = 100 THEN 'completed'
  ELSE 'started'
END;

-- Make status column NOT NULL after updating existing data
ALTER TABLE public.tutorial_progress 
ALTER COLUMN status SET NOT NULL;

-- Remove the progress column as we're using status instead
ALTER TABLE public.tutorial_progress 
DROP COLUMN IF EXISTS progress;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_tutorial_progress_user_status 
ON public.tutorial_progress(user_id, status);

-- Add comment to explain the new system
COMMENT ON TABLE public.tutorial_progress IS 'Tracks tutorial start/completion status for users. Overall progress is calculated as (completed_count / started_count) * 100';
COMMENT ON COLUMN public.tutorial_progress.status IS 'Tutorial status: started (user clicked Start) or completed (user clicked Mark Done)';
