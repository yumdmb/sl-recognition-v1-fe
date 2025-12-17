-- Migration: Create post_likes table for forum post likes
-- Rollback: DROP TABLE IF EXISTS public.post_likes;

-- Create post_likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT post_likes_unique UNIQUE (post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view post likes
CREATE POLICY "Anyone can view post likes"
    ON public.post_likes
    FOR SELECT
    USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Users can like posts"
    ON public.post_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own likes
CREATE POLICY "Users can unlike posts"
    ON public.post_likes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);

-- Add comment
COMMENT ON TABLE public.post_likes IS 'Stores likes for forum posts';
