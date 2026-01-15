-- Migration: fix_user_deletion_constraints
-- Description: Update FK constraints to ON DELETE SET NULL for user deletion support

-- Rollback:
-- ALTER TABLE public.gesture_contributions DROP CONSTRAINT gesture_contributions_reviewed_by_fkey;
-- ALTER TABLE public.gesture_contributions ADD CONSTRAINT gesture_contributions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.user_profiles(id) ON DELETE NO ACTION;
-- ALTER TABLE public.gesture_contributions DROP CONSTRAINT gesture_contributions_submitted_by_fkey;
-- ALTER TABLE public.gesture_contributions ADD CONSTRAINT gesture_contributions_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.user_profiles(id) ON DELETE NO ACTION;
-- ALTER TABLE public.sign_avatars DROP CONSTRAINT sign_avatars_reviewed_by_fkey;
-- ALTER TABLE public.sign_avatars ADD CONSTRAINT sign_avatars_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.user_profiles(id) ON DELETE NO ACTION;

-- 1. gesture_contributions: reviewed_by
ALTER TABLE public.gesture_contributions
DROP CONSTRAINT IF EXISTS gesture_contributions_reviewed_by_fkey;

ALTER TABLE public.gesture_contributions
ADD CONSTRAINT gesture_contributions_reviewed_by_fkey
FOREIGN KEY (reviewed_by)
REFERENCES public.user_profiles(id)
ON DELETE SET NULL;

-- 2. gesture_contributions: submitted_by
ALTER TABLE public.gesture_contributions
DROP CONSTRAINT IF EXISTS gesture_contributions_submitted_by_fkey;

ALTER TABLE public.gesture_contributions
ADD CONSTRAINT gesture_contributions_submitted_by_fkey
FOREIGN KEY (submitted_by)
REFERENCES public.user_profiles(id)
ON DELETE SET NULL;

-- 3. sign_avatars: reviewed_by
ALTER TABLE public.sign_avatars
DROP CONSTRAINT IF EXISTS sign_avatars_reviewed_by_fkey;

ALTER TABLE public.sign_avatars
ADD CONSTRAINT sign_avatars_reviewed_by_fkey
FOREIGN KEY (reviewed_by)
REFERENCES public.user_profiles(id)
ON DELETE SET NULL;
