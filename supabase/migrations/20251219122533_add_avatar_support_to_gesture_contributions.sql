-- Migration: Add avatar support to gesture_contributions
-- Description: Allows 3D avatars to be displayed in Gesture Dictionary alongside images/videos
-- Rollback: 
--   ALTER TABLE public.gesture_contributions DROP CONSTRAINT IF EXISTS gesture_contributions_media_type_check;
--   ALTER TABLE public.gesture_contributions ADD CONSTRAINT gesture_contributions_media_type_check CHECK (media_type = ANY (ARRAY['image'::text, 'video'::text]));
--   ALTER TABLE public.gesture_contributions DROP COLUMN IF EXISTS avatar_id;
--   DROP INDEX IF EXISTS idx_gesture_contributions_avatar_id;

-- Step 1: Add avatar_id column to link to sign_avatars table
ALTER TABLE public.gesture_contributions 
ADD COLUMN IF NOT EXISTS avatar_id uuid REFERENCES public.sign_avatars(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.gesture_contributions.avatar_id IS 'Reference to sign_avatars table for 3D avatar entries';

-- Step 2: Update media_type check constraint to include 'avatar'
-- First drop the existing constraint
ALTER TABLE public.gesture_contributions 
DROP CONSTRAINT IF EXISTS gesture_contributions_media_type_check;

-- Add new constraint with 'avatar' option
ALTER TABLE public.gesture_contributions 
ADD CONSTRAINT gesture_contributions_media_type_check 
CHECK (media_type = ANY (ARRAY['image'::text, 'video'::text, 'avatar'::text]));

-- Step 3: Make media_url nullable (avatars don't need media_url, they use avatar_id)
ALTER TABLE public.gesture_contributions 
ALTER COLUMN media_url DROP NOT NULL;

-- Step 4: Add index for avatar_id lookups
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_avatar_id 
ON public.gesture_contributions(avatar_id) 
WHERE avatar_id IS NOT NULL;

-- Step 5: Add composite index for dictionary queries with avatar support
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_title_language_media 
ON public.gesture_contributions(title, language, media_type) 
WHERE status = 'approved';

-- Step 6: Add check constraint to ensure either media_url or avatar_id is provided
ALTER TABLE public.gesture_contributions 
ADD CONSTRAINT gesture_contributions_media_check 
CHECK (
  (media_type IN ('image', 'video') AND media_url IS NOT NULL) OR
  (media_type = 'avatar' AND avatar_id IS NOT NULL)
);

-- Step 7: Update source check constraint to include 'avatar'
ALTER TABLE public.gesture_contributions 
DROP CONSTRAINT IF EXISTS gesture_contributions_source_check;

ALTER TABLE public.gesture_contributions 
ADD CONSTRAINT gesture_contributions_source_check 
CHECK (source = ANY (ARRAY['admin'::text, 'contribution'::text, 'avatar'::text]));

COMMENT ON TABLE public.gesture_contributions IS 'Unified gesture dictionary supporting images, videos, and 3D avatars';
