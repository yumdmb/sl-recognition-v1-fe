-- Migration: Create forum_attachments table for image attachments in forum posts and comments
-- Rollback: DROP TABLE IF EXISTS public.forum_attachments; DROP POLICY IF EXISTS "forum_attachments_bucket_policy" ON storage.objects;

-- Create forum_attachments table
CREATE TABLE IF NOT EXISTS public.forum_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure attachment belongs to either a post or a comment (not both, not neither)
  CONSTRAINT attachment_belongs_to_post_or_comment CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Add table comment
COMMENT ON TABLE public.forum_attachments IS 'Stores image attachments for forum posts and comments. Each attachment belongs to either a post or a comment.';

-- Enable Row Level Security
ALTER TABLE public.forum_attachments ENABLE ROW LEVEL SECURITY;

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_forum_attachments_post_id ON public.forum_attachments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_attachments_comment_id ON public.forum_attachments(comment_id);
CREATE INDEX IF NOT EXISTS idx_forum_attachments_user_id ON public.forum_attachments(user_id);

-- RLS Policies

-- Anyone can view attachments (for displaying in posts/comments)
CREATE POLICY "Anyone can view forum attachments"
  ON public.forum_attachments
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert their own attachments
CREATE POLICY "Authenticated users can upload attachments"
  ON public.forum_attachments
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
  ON public.forum_attachments
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT ON public.forum_attachments TO anon;
GRANT SELECT ON public.forum_attachments TO authenticated;
GRANT INSERT, DELETE ON public.forum_attachments TO authenticated;
GRANT ALL ON public.forum_attachments TO service_role;
