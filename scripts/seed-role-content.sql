-- Script to add sample content with role indicators for testing
-- Run this in Supabase SQL Editor or via CLI

-- Add deaf-specific tutorial
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url)
VALUES (
  'Visual Sign Language Basics for Deaf Learners',
  'Learn MSL through pure visual demonstrations without audio explanations. Perfect for deaf community members.',
  'https://www.youtube.com/watch?v=sample1',
  'beginner',
  'MSL',
  'deaf',
  'https://via.placeholder.com/300x200'
) ON CONFLICT DO NOTHING;

-- Add non-deaf-specific tutorial
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url)
VALUES (
  'MSL with Pronunciation Guide',
  'Learn MSL with detailed pronunciation explanations and hearing perspective context.',
  'https://www.youtube.com/watch?v=sample2',
  'beginner',
  'MSL',
  'non-deaf',
  'https://via.placeholder.com/300x200'
) ON CONFLICT DO NOTHING;

-- Add universal tutorial
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url)
VALUES (
  'MSL Alphabet for Everyone',
  'Universal MSL alphabet tutorial suitable for all learners.',
  'https://www.youtube.com/watch?v=sample3',
  'beginner',
  'MSL',
  'all',
  'https://via.placeholder.com/300x200'
) ON CONFLICT DO NOTHING;

-- Add deaf-specific material
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size)
VALUES (
  'Deaf Community Cultural Guide',
  'Visual guide to deaf culture and community practices.',
  'application/pdf',
  'https://example.com/deaf-culture.pdf',
  'beginner',
  'MSL',
  'deaf',
  1024000
) ON CONFLICT DO NOTHING;

-- Add non-deaf-specific material
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size)
VALUES (
  'Hearing Perspective: Understanding Sign Language',
  'Guide for hearing individuals learning sign language with comparative examples.',
  'application/pdf',
  'https://example.com/hearing-guide.pdf',
  'beginner',
  'MSL',
  'non-deaf',
  1024000
) ON CONFLICT DO NOTHING;

-- Add universal material
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size)
VALUES (
  'MSL Dictionary',
  'Comprehensive MSL dictionary for all learners.',
  'application/pdf',
  'https://example.com/msl-dictionary.pdf',
  'beginner',
  'MSL',
  'all',
  2048000
) ON CONFLICT DO NOTHING;

-- Add deaf-specific quiz
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role)
VALUES (
  'Visual Recognition Quiz',
  'Test your sign recognition skills with visual-only questions.',
  'MSL',
  'deaf'
) ON CONFLICT DO NOTHING;

-- Add non-deaf-specific quiz
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role)
VALUES (
  'Sign and Pronunciation Quiz',
  'Practice signs with pronunciation and context.',
  'MSL',
  'non-deaf'
) ON CONFLICT DO NOTHING;

-- Add universal quiz
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role)
VALUES (
  'MSL Basics Quiz',
  'General MSL knowledge quiz for all learners.',
  'MSL',
  'all'
) ON CONFLICT DO NOTHING;
