-- Migration: fix_user_deletion_cascade
-- Description: Update chats_created_by_fkey to cascade delete to allow user deletion

-- Drop the existing constraint
ALTER TABLE public.chats
DROP CONSTRAINT chats_created_by_fkey;

-- Re-add the constraint with ON DELETE CASCADE
ALTER TABLE public.chats
ADD CONSTRAINT chats_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES auth.users(id)
ON DELETE CASCADE;
