# Task 12: Create Forum Database Migration

## Changes Made

- Created migration `20251215071815_create_comment_likes_table.sql`:
  - `comment_likes` table with `comment_id`, `user_id`, unique constraint
  - RLS policies for viewing, liking, and unliking comments
  - Indexes for efficient queries

- Created migration `20251215072134_create_forum_attachments_table.sql`:
  - `forum_attachments` table with `post_id`, `comment_id`, `file_url`, `file_type`, `file_name`
  - CHECK constraint ensuring attachment belongs to either post OR comment
  - RLS policies for viewing, uploading, and deleting attachments

- Created migration `20251215072205_create_forum_attachments_storage.sql`:
  - Storage bucket `forum_attachments` with 5MB limit
  - Allowed MIME types: jpeg, png, gif, webp
  - Storage policies for public read and authenticated upload/delete

- Updated `src/types/database.types.ts` with new table types

## To Verify

1. Go to Supabase Dashboard > Table Editor
2. Confirm `comment_likes` table exists with columns: id, comment_id, user_id, created_at
3. Confirm `forum_attachments` table exists with columns: id, post_id, comment_id, file_url, file_type, file_name, user_id, created_at
4. Go to Storage > Buckets and confirm `forum_attachments` bucket exists

## Look For

- Both tables have RLS enabled
- Unique constraint on (comment_id, user_id) in comment_likes
- CHECK constraint on forum_attachments ensuring post_id XOR comment_id
- Storage bucket allows only image MIME types
