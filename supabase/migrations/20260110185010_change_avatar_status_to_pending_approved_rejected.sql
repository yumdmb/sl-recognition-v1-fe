-- Migration: Change avatar status from verified/unverified to pending/approved/rejected
-- Rollback: 
--   UPDATE public.sign_avatars SET status = 'verified' WHERE status = 'approved';
--   UPDATE public.sign_avatars SET status = 'unverified' WHERE status IN ('pending', 'rejected');
--   ALTER TABLE public.sign_avatars DROP CONSTRAINT IF EXISTS sign_avatars_status_check;
--   ALTER TABLE public.sign_avatars ADD CONSTRAINT sign_avatars_status_check CHECK (status IN ('verified', 'unverified'));

-- Step 1: Drop the existing status CHECK constraint FIRST
ALTER TABLE public.sign_avatars DROP CONSTRAINT IF EXISTS sign_avatars_status_check;

-- Step 2: Migrate existing data BEFORE adding new constraint
-- 'unverified' -> 'pending' (avatars waiting for review)
-- 'verified' -> 'approved' (avatars already verified by admin)
UPDATE public.sign_avatars SET status = 'pending' WHERE status = 'unverified';
UPDATE public.sign_avatars SET status = 'approved' WHERE status = 'verified';

-- Step 3: Add new status CHECK constraint with pending/approved/rejected
ALTER TABLE public.sign_avatars 
ADD CONSTRAINT sign_avatars_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Step 4: Update the default value for new avatars
ALTER TABLE public.sign_avatars ALTER COLUMN status SET DEFAULT 'pending';

-- Step 5: Add optional rejection_reason column for admin feedback
ALTER TABLE public.sign_avatars 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

COMMENT ON COLUMN public.sign_avatars.rejection_reason IS 'Optional reason provided by admin when rejecting an avatar';

-- Step 6: Update RLS Policies for new status values
-- Drop old policies that reference 'verified'
DROP POLICY IF EXISTS "Anyone can view verified avatars" ON public.sign_avatars;

-- Create new policy: Anyone can view approved avatars
CREATE POLICY "Anyone can view approved avatars"
    ON public.sign_avatars
    FOR SELECT
    USING (status = 'approved');

-- Update policy for users editing their own avatars (only pending avatars can be edited)
DROP POLICY IF EXISTS "Users can update own unverified avatars" ON public.sign_avatars;

CREATE POLICY "Users can update own pending avatars"
    ON public.sign_avatars
    FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_sign_avatars_status_pending ON public.sign_avatars(status) WHERE status = 'pending';
