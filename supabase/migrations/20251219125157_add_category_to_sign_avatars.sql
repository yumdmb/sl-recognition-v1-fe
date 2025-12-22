-- Migration: Add category support to sign_avatars
-- Description: Allows users to select a category when generating avatars, admin can edit
-- Rollback: ALTER TABLE public.sign_avatars DROP COLUMN IF EXISTS category_id;

-- Add category_id column to sign_avatars
ALTER TABLE public.sign_avatars 
ADD COLUMN IF NOT EXISTS category_id bigint REFERENCES public.gesture_categories(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.sign_avatars.category_id IS 'Category of the avatar gesture, references gesture_categories table';

-- Add index for category lookups
CREATE INDEX IF NOT EXISTS idx_sign_avatars_category_id 
ON public.sign_avatars(category_id) 
WHERE category_id IS NOT NULL;
