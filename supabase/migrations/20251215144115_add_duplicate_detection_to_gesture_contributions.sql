-- Migration: Add duplicate detection columns to gesture_contributions
-- Rollback: ALTER TABLE gesture_contributions DROP COLUMN IF EXISTS is_duplicate; ALTER TABLE gesture_contributions DROP COLUMN IF EXISTS duplicate_of;

-- Add columns for duplicate tracking
ALTER TABLE public.gesture_contributions 
ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS duplicate_of TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.gesture_contributions.is_duplicate IS 'Flag indicating if this contribution has a duplicate title+language combination';
COMMENT ON COLUMN public.gesture_contributions.duplicate_of IS 'Description of what this is a duplicate of (e.g., "Existing gesture: Hello (ASL)" or "Contribution #123")';

-- Create index for faster duplicate lookups
CREATE INDEX IF NOT EXISTS idx_gesture_contributions_title_language 
ON public.gesture_contributions(LOWER(title), language);

-- Function to check and mark duplicates for a contribution
CREATE OR REPLACE FUNCTION public.check_gesture_contribution_duplicates(contribution_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    contrib_record RECORD;
    duplicate_sources TEXT[] := '{}';
    is_dup BOOLEAN := FALSE;
    existing_gesture RECORD;
    existing_contribution RECORD;
BEGIN
    -- Get the contribution details
    SELECT id, title, language INTO contrib_record
    FROM public.gesture_contributions
    WHERE id = contribution_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Contribution not found');
    END IF;
    
    -- Check against existing gestures table (case-insensitive)
    FOR existing_gesture IN 
        SELECT id, name, language 
        FROM public.gestures 
        WHERE LOWER(name) = LOWER(contrib_record.title) 
        AND language = contrib_record.language
    LOOP
        is_dup := TRUE;
        duplicate_sources := array_append(duplicate_sources, 
            format('Existing gesture: %s (%s)', existing_gesture.name, existing_gesture.language));
    END LOOP;
    
    -- Check against other contributions (excluding self, case-insensitive)
    FOR existing_contribution IN 
        SELECT id, title, language, status
        FROM public.gesture_contributions 
        WHERE LOWER(title) = LOWER(contrib_record.title) 
        AND language = contrib_record.language
        AND id != contribution_id
        ORDER BY created_at ASC
    LOOP
        is_dup := TRUE;
        duplicate_sources := array_append(duplicate_sources, 
            format('Other contribution: %s (%s) - %s', 
                existing_contribution.title, 
                existing_contribution.language,
                existing_contribution.status));
    END LOOP;
    
    -- Update the contribution with duplicate info
    UPDATE public.gesture_contributions
    SET 
        is_duplicate = is_dup,
        duplicate_of = CASE WHEN is_dup THEN array_to_string(duplicate_sources, '; ') ELSE NULL END
    WHERE id = contribution_id;
    
    RETURN jsonb_build_object(
        'is_duplicate', is_dup,
        'duplicate_sources', duplicate_sources
    );
END;
$$;

-- Function to refresh all duplicate flags (useful for batch updates)
CREATE OR REPLACE FUNCTION public.refresh_all_gesture_contribution_duplicates()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    contrib RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR contrib IN SELECT id FROM public.gesture_contributions
    LOOP
        PERFORM public.check_gesture_contribution_duplicates(contrib.id);
        updated_count := updated_count + 1;
    END LOOP;
    
    RETURN updated_count;
END;
$$;

-- Trigger to automatically check duplicates on insert
CREATE OR REPLACE FUNCTION public.trigger_check_contribution_duplicates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check duplicates for the new/updated contribution
    PERFORM public.check_gesture_contribution_duplicates(NEW.id);
    RETURN NEW;
END;
$$;

-- Create trigger for new contributions
DROP TRIGGER IF EXISTS on_gesture_contribution_check_duplicates ON public.gesture_contributions;
CREATE TRIGGER on_gesture_contribution_check_duplicates
AFTER INSERT ON public.gesture_contributions
FOR EACH ROW
EXECUTE FUNCTION public.trigger_check_contribution_duplicates();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_gesture_contribution_duplicates(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_all_gesture_contribution_duplicates() TO authenticated;
