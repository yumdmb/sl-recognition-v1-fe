-- Match the formats offered by the material uploader and its 50 MB limit.
UPDATE storage.buckets
SET file_size_limit = 52428800,
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
    ]
WHERE id = 'materials';

-- Material records are admin managed; their storage uploads must be as well.
DROP POLICY IF EXISTS "allow_authenticated_uploads_on_materials" ON storage.objects;
DROP POLICY IF EXISTS "allow_admin_uploads_on_materials" ON storage.objects;
CREATE POLICY "allow_admin_uploads_on_materials"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'materials'
  AND EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
