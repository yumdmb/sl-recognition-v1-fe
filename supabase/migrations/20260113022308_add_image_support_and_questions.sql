-- Migration: Add image support to proficiency test questions and choices
-- Rollback: ALTER TABLE proficiency_test_questions DROP COLUMN image_url; ALTER TABLE proficiency_test_question_choices DROP COLUMN image_url;

-- =============================================================================
-- PART 1: Add image_url columns
-- =============================================================================

ALTER TABLE public.proficiency_test_questions 
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.proficiency_test_question_choices 
ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN public.proficiency_test_questions.image_url IS 'Optional URL to an image for visual questions (e.g., showing a sign gesture)';
COMMENT ON COLUMN public.proficiency_test_question_choices.image_url IS 'Optional URL to an image for visual answer choices';

-- =============================================================================
-- PART 2: Add RLS policies for admin CRUD operations
-- =============================================================================

-- Allow admins to insert questions
CREATE POLICY "Admins can insert questions" ON public.proficiency_test_questions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update questions
CREATE POLICY "Admins can update questions" ON public.proficiency_test_questions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to delete questions
CREATE POLICY "Admins can delete questions" ON public.proficiency_test_questions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to insert choices
CREATE POLICY "Admins can insert choices" ON public.proficiency_test_question_choices
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update choices
CREATE POLICY "Admins can update choices" ON public.proficiency_test_question_choices
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to delete choices
CREATE POLICY "Admins can delete choices" ON public.proficiency_test_question_choices
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
