-- Migration: Create sign_avatars table for storing 3D gesture recordings
-- Rollback: DROP TABLE IF EXISTS public.sign_avatars;

-- Create sign_avatars table
CREATE TABLE IF NOT EXISTS public.sign_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL CHECK (language IN ('ASL', 'MSL')),
    status TEXT NOT NULL DEFAULT 'unverified' CHECK (status IN ('verified', 'unverified')),
    
    -- 3D Recording data (JSONB for efficient storage and querying)
    recording_data JSONB NOT NULL,
    frame_count INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    
    -- User relationship
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Admin review
    reviewed_by UUID REFERENCES public.user_profiles(id),
    reviewed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comment
COMMENT ON TABLE public.sign_avatars IS 'Stores 3D sign language gesture recordings with hand landmark data';
COMMENT ON COLUMN public.sign_avatars.recording_data IS 'JSONB containing frames array with hand landmarks (x,y,z coordinates for 21 points per hand)';
COMMENT ON COLUMN public.sign_avatars.frame_count IS 'Number of frames in the recording (1 for static pose, >1 for animation)';
COMMENT ON COLUMN public.sign_avatars.duration_ms IS 'Duration of recording in milliseconds (0 for static pose)';

-- Enable RLS
ALTER TABLE public.sign_avatars ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view all verified avatars
CREATE POLICY "Anyone can view verified avatars"
    ON public.sign_avatars
    FOR SELECT
    USING (status = 'verified');

-- Users can view their own avatars (including unverified)
CREATE POLICY "Users can view own avatars"
    ON public.sign_avatars
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own avatars
CREATE POLICY "Users can create own avatars"
    ON public.sign_avatars
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own unverified avatars
CREATE POLICY "Users can update own unverified avatars"
    ON public.sign_avatars
    FOR UPDATE
    USING (auth.uid() = user_id AND status = 'unverified')
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own avatars
CREATE POLICY "Users can delete own avatars"
    ON public.sign_avatars
    FOR DELETE
    USING (auth.uid() = user_id);

-- Admins can do everything (check role from user_profiles)
CREATE POLICY "Admins have full access"
    ON public.sign_avatars
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Indexes for performance
CREATE INDEX idx_sign_avatars_user_id ON public.sign_avatars(user_id);
CREATE INDEX idx_sign_avatars_status ON public.sign_avatars(status);
CREATE INDEX idx_sign_avatars_language ON public.sign_avatars(language);
CREATE INDEX idx_sign_avatars_created_at ON public.sign_avatars(created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_sign_avatars_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sign_avatars_updated_at
    BEFORE UPDATE ON public.sign_avatars
    FOR EACH ROW
    EXECUTE FUNCTION public.update_sign_avatars_updated_at();
