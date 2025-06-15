-- Add reviewed_at column to gesture_contributions table
ALTER TABLE IF EXISTS gesture_contributions 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Update schema cache (for Supabase)
NOTIFY pgrst, 'reload schema';
