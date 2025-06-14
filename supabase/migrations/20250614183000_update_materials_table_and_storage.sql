-- Create a new storage bucket for materials if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('materials', 'materials', true, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/jpeg', 'image/png', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the materials bucket

-- Policy: Allow public read access on materials
CREATE POLICY "allow_public_read_on_materials"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'materials' );

-- Policy: Allow authenticated users to upload materials
CREATE POLICY "allow_authenticated_uploads_on_materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'materials' );

-- Policy: Allow admins to update materials
CREATE POLICY "allow_admin_updates_on_materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'materials' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Allow admins to delete materials
CREATE POLICY "allow_admin_deletes_on_materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'materials' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Update the materials table schema

-- Drop the old check constraint for 'type'
ALTER TABLE public.materials
DROP CONSTRAINT IF EXISTS materials_type_check;

-- Change file_size to BIGINT to store bytes. Assumes existing values are convertible.
ALTER TABLE public.materials
ALTER COLUMN file_size TYPE BIGINT USING NULLIF(file_size, '')::BIGINT;

-- Add a file_path column to store the storage path if it doesn't exist
ALTER TABLE public.materials
ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Add a comment to clarify the purpose of file_size
COMMENT ON COLUMN public.materials.file_size IS 'File size in bytes';