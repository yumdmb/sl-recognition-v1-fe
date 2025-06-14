ALTER TABLE public.chats
ADD COLUMN created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Drop existing policies that are causing issues
DROP POLICY IF EXISTS insert_chats ON public.chats;
DROP POLICY IF EXISTS insert_chat_participants ON public.chat_participants;

-- Allow users to create chats, and mark them as the creator
CREATE POLICY insert_chats ON public.chats
FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid());

-- Allow the chat creator to add participants to the chat
-- and allow users to add themselves to a chat.
CREATE POLICY insert_chat_participants ON public.chat_participants
FOR INSERT TO authenticated
WITH CHECK (
  (
    SELECT created_by
    FROM public.chats
    WHERE id = chat_id
  ) = auth.uid()
  OR
  user_id = auth.uid()
);