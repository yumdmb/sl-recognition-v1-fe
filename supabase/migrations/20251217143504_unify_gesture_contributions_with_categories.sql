-- Migration: Unify gesture_contributions with categories for unified gesture system
-- This adds category support to gesture_contributions and a source field to track origin
-- Rollback: 
--   ALTER TABLE public.gesture_contributions DROP COLUMN IF EXISTS category_id;
--   ALTER TABLE public.gesture_contributions DROP COLUMN IF EXISTS source;
--   DROP INDEX IF EXISTS idx_gesture_contributions_category_id;
--   DROP INDEX IF EXISTS idx_gesture_contributions_source;
--   DROP INDEX IF EXISTS idx_gesture_contributions_approved_category;

-- Add category_id column to gesture_contributions
ALTER TABLE public.gesture_contributions 
  ADD COLUMN IF NOT EXISTS category_id bigint REFERENCES public.gesture_categories(id);

-- Add source column to track if gesture was added by admin directly or via user contribution
ALTER TABLE public.gesture_contributions 
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'contribution' 
  CHECK (source IN ('admin', 'contribution'));

-- Add index for category lookups
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_category_id 
  ON public.gesture_contributions(category_id);

-- Add index for source filtering
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_source 
  ON public.gesture_contributions(source);

-- Add composite index for approved gestures by category (common query pattern)
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_approved_category 
  ON public.gesture_contributions(status, category_id) 
  WHERE status = 'approved';

-- Add composite index for approved gestures by language (for dictionary search)
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_approved_language 
  ON public.gesture_contributions(status, language) 
  WHERE status = 'approved';

-- Add comments for documentation
COMMENT ON COLUMN public.gesture_contributions.category_id IS 'Category of the gesture, references gesture_categories table';
COMMENT ON COLUMN public.gesture_contributions.source IS 'Origin of gesture: admin (direct add) or contribution (user submitted)';

-- Migrate existing data from gestures table to gesture_contributions (if any exists)
-- This inserts gestures that don't already exist in contributions (by title+language combo)
-- Only migrate gestures that have a user_id (required for submitted_by)
INSERT INTO public.gesture_contributions (
  title,
  description,
  language,
  media_type,
  media_url,
  category_id,
  source,
  status,
  submitted_by,
  created_at,
  updated_at
)
SELECT 
  g.name as title,
  g.description,
  g.language,
  g.media_type,
  g.media_url,
  g.category_id,
  'admin' as source,
  'approved' as status,
  g.user_id as submitted_by,
  g.created_at,
  g.updated_at
FROM public.gestures g
WHERE g.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.gesture_contributions gc 
    WHERE gc.title = g.name AND gc.language = g.language
  )
ON CONFLICT DO NOTHING;

-- For gestures without user_id, we need to assign a default admin user
-- First, get an admin user to use as the submitter for orphaned gestures
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the first admin user
  SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;
  
  -- If we found an admin, migrate the orphaned gestures
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.gesture_contributions (
      title,
      description,
      language,
      media_type,
      media_url,
      category_id,
      source,
      status,
      submitted_by,
      created_at,
      updated_at
    )
    SELECT 
      g.name as title,
      g.description,
      g.language,
      g.media_type,
      g.media_url,
      g.category_id,
      'admin' as source,
      'approved' as status,
      admin_user_id as submitted_by,
      g.created_at,
      g.updated_at
    FROM public.gestures g
    WHERE g.user_id IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.gesture_contributions gc 
        WHERE gc.title = g.name AND gc.language = g.language
      )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
