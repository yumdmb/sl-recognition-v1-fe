-- Update tutorials table to support auto-populated YouTube metadata
-- Make duration nullable with default value since it will be auto-populated

-- Remove NOT NULL constraint from duration and set default
ALTER TABLE public.tutorials 
ALTER COLUMN duration DROP NOT NULL,
ALTER COLUMN duration SET DEFAULT '0:00';

-- Add comment to clarify that these fields are auto-populated
COMMENT ON COLUMN public.tutorials.thumbnail_url IS 'Auto-populated from YouTube video metadata';
COMMENT ON COLUMN public.tutorials.duration IS 'Auto-populated from YouTube video metadata, format: MM:SS or HH:MM:SS';

-- Update any existing tutorials with empty duration
UPDATE public.tutorials 
SET duration = '0:00' 
WHERE duration IS NULL OR duration = '';
