-- Remove duration column from tutorials table
ALTER TABLE public.tutorials 
DROP COLUMN IF EXISTS duration;

-- Remove related comment
COMMENT ON COLUMN public.tutorials.duration IS NULL;
