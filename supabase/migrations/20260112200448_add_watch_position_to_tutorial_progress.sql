-- Migration: Add watch_position column to tutorial_progress table
-- Purpose: Store the user's last watched position (in seconds) for video resume functionality
-- Rollback: ALTER TABLE public.tutorial_progress DROP COLUMN IF EXISTS watch_position;

-- Add watch_position column to store the video timestamp in seconds
ALTER TABLE public.tutorial_progress 
ADD COLUMN IF NOT EXISTS watch_position REAL DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN public.tutorial_progress.watch_position IS 'Last watched position in seconds for video resume functionality';
