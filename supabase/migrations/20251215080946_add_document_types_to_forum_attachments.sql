-- Migration: Add document types (PDF, Word, etc.) to forum attachments storage bucket
-- Rollback: UPDATE storage.buckets SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'] WHERE id = 'forum_attachments';

-- Update the forum_attachments bucket to allow additional file types
UPDATE storage.buckets 
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ],
  file_size_limit = 10485760  -- Increase to 10MB for documents
WHERE id = 'forum_attachments';
