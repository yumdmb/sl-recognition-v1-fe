-- Create gesture_contributions table
CREATE TABLE IF NOT EXISTS gesture_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    language TEXT NOT NULL, -- e.g., 'ASL', 'MSL'
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    submitted_by UUID NOT NULL REFERENCES public.user_profiles(id), -- Changed to reference user_profiles
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.user_profiles(id), -- Changed to reference user_profiles
    reviewed_at TIMESTAMPTZ, -- Added missing reviewed_at column
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies for gesture_contributions

-- Allow public read access to approved gestures
CREATE POLICY "Public can read approved gesture contributions"
ON gesture_contributions
FOR SELECT
USING (status = 'approved');

-- Allow authenticated users to insert their own contributions
CREATE POLICY "Authenticated users can insert their own gesture contributions"
ON gesture_contributions
FOR INSERT
WITH CHECK (submitted_by = auth.uid()); -- Assumes user_profiles.id is the same as auth.uid() and is used for submitted_by

-- Allow users to read their own submissions
CREATE POLICY "Users can read their own gesture contributions"
ON gesture_contributions
FOR SELECT
USING (submitted_by = auth.uid());

-- Allow users to update their own pending submissions
CREATE POLICY "Users can update their own pending gesture contributions"
ON gesture_contributions
FOR UPDATE
USING (submitted_by = auth.uid() AND status = 'pending')
WITH CHECK (submitted_by = auth.uid() AND status = 'pending');

-- Allow users to delete their own pending or rejected submissions
CREATE POLICY "Users can delete their own pending or rejected gesture contributions"
ON gesture_contributions
FOR DELETE
USING (submitted_by = auth.uid() AND (status = 'pending' OR status = 'rejected'));

-- Admin users have full access
CREATE POLICY "Admin users have full access to gesture contributions"
ON gesture_contributions
FOR ALL
USING (EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
));

-- Enable RLS
ALTER TABLE gesture_contributions ENABLE ROW LEVEL SECURITY;

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
CREATE TRIGGER on_gesture_contributions_updated
BEFORE UPDATE ON gesture_contributions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_status ON gesture_contributions(status);
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_submitted_by ON gesture_contributions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_language ON gesture_contributions(language);

-- Storage policy for media files in 'media' bucket, 'gesture-contributions' folder

-- Allow authenticated users to upload to gesture-contributions folder
DROP POLICY IF EXISTS "Authenticated users can upload to gesture-contributions" ON storage.objects;
CREATE POLICY "Authenticated users can upload to gesture-contributions"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND name LIKE 'gesture-contributions/%' AND owner = auth.uid());

-- Allow public read access to files in gesture-contributions folder
DROP POLICY IF EXISTS "Public can read gesture-contributions media" ON storage.objects;
CREATE POLICY "Public can read gesture-contributions media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media' AND name LIKE 'gesture-contributions/%');

-- Allow owners to update their files in gesture-contributions media
DROP POLICY IF EXISTS "Owners can update their gesture-contributions media" ON storage.objects;
CREATE POLICY "Owners can update their gesture-contributions media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media' AND name LIKE 'gesture-contributions/%' AND owner = auth.uid())
WITH CHECK (bucket_id = 'media' AND name LIKE 'gesture-contributions/%' AND owner = auth.uid());

-- Allow owners to delete their files in gesture-contributions folder
DROP POLICY IF EXISTS "Owners can delete their gesture-contributions media" ON storage.objects;
CREATE POLICY "Owners can delete their gesture-contributions media"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND name LIKE 'gesture-contributions/%' AND owner = auth.uid());
