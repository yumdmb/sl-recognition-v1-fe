-- Migration: Create storage bucket and policies for forum attachments
-- Rollback: DELETE FROM storage.buckets WHERE id = 'forum_attachments';

-- Create storage bucket for forum attachments (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'forum_attachments',
  'forum_attachments',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for forum_attachments bucket

-- Allow public read access to forum attachments
CREATE POLICY "Public read access for forum attachments"
  ON storage.objects
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (bucket_id = 'forum_attachments');

-- Allow authenticated users to upload forum attachments
CREATE POLICY "Authenticated users can upload forum attachments"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'forum_attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own forum attachments
CREATE POLICY "Users can delete their own forum attachments"
  ON storage.objects
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'forum_attachments' AND
    owner = auth.uid()
  );

-- Allow users to update their own forum attachments
CREATE POLICY "Users can update their own forum attachments"
  ON storage.objects
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'forum_attachments' AND
    owner = auth.uid()
  );
