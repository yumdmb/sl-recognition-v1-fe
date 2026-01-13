-- Migration: Create storage bucket for proficiency test images
-- Rollback: DELETE FROM storage.buckets WHERE id = 'proficiency-test-images';

-- Create the storage bucket for proficiency test images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proficiency-test-images',
  'proficiency-test-images',
  true,  -- Public bucket so images can be displayed without auth
  5242880,  -- 5MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- RLS Policies for the bucket

-- Allow everyone to view images (public bucket)
CREATE POLICY "Public read access for proficiency test images"
ON storage.objects FOR SELECT
USING (bucket_id = 'proficiency-test-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload proficiency test images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'proficiency-test-images' AND
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow admins to update images
CREATE POLICY "Admins can update proficiency test images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'proficiency-test-images' AND
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete proficiency test images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'proficiency-test-images' AND
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
