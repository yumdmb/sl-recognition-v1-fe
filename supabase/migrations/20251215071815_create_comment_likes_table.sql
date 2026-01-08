-- Migration: Create comment_likes table for forum comment like functionality
-- Rollback: DROP TABLE IF EXISTS public.comment_likes;

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Add table comment
COMMENT ON TABLE public.comment_likes IS 'Stores likes on forum comments. Each user can only like a comment once.';

-- Enable Row Level Security
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);

-- RLS Policies

-- Anyone can view likes (for displaying like counts)
CREATE POLICY "Anyone can view comment likes"
  ON public.comment_likes
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated users can like comments"
  ON public.comment_likes
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes (unlike)
CREATE POLICY "Users can unlike their own likes"
  ON public.comment_likes
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permissions to authenticated and service_role
GRANT SELECT ON public.comment_likes TO anon;
GRANT SELECT ON public.comment_likes TO authenticated;
GRANT INSERT, DELETE ON public.comment_likes TO authenticated;
GRANT ALL ON public.comment_likes TO service_role;
