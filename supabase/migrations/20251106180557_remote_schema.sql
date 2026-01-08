drop extension if exists "pg_net";

drop policy "service_role_full_access" on "public"."user_profiles";

drop policy "authenticated_users_update_own_profile" on "public"."user_profiles";


  create table "public"."chat_participants" (
    "id" uuid not null default gen_random_uuid(),
    "chat_id" uuid not null,
    "user_id" uuid not null,
    "joined_at" timestamp with time zone default now()
      );


alter table "public"."chat_participants" enable row level security;


  create table "public"."chats" (
    "id" uuid not null default gen_random_uuid(),
    "is_group" boolean not null default false,
    "name" text,
    "created_at" timestamp with time zone default now(),
    "last_message_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid default auth.uid()
      );


alter table "public"."chats" enable row level security;


  create table "public"."forum_comments" (
    "id" uuid not null default gen_random_uuid(),
    "post_id" uuid,
    "content" text not null,
    "user_id" uuid,
    "parent_comment_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."forum_comments" enable row level security;


  create table "public"."forum_posts" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "content" text not null,
    "user_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."forum_posts" enable row level security;


  create table "public"."message_status" (
    "id" uuid not null default gen_random_uuid(),
    "message_id" uuid not null,
    "user_id" uuid not null,
    "is_read" boolean default false,
    "read_at" timestamp with time zone
      );


alter table "public"."message_status" enable row level security;


  create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "chat_id" uuid not null,
    "sender_id" uuid not null,
    "content" text not null,
    "file_url" text,
    "reply_to_id" uuid,
    "is_edited" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."messages" enable row level security;

alter table "public"."tutorials" drop column "duration";

CREATE UNIQUE INDEX chat_participants_chat_id_user_id_key ON public.chat_participants USING btree (chat_id, user_id);

CREATE UNIQUE INDEX chat_participants_pkey ON public.chat_participants USING btree (id);

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX forum_comments_pkey ON public.forum_comments USING btree (id);

CREATE UNIQUE INDEX forum_posts_pkey ON public.forum_posts USING btree (id);

CREATE INDEX idx_chat_participants_chat_id ON public.chat_participants USING btree (chat_id);

CREATE INDEX idx_chat_participants_user_id ON public.chat_participants USING btree (user_id);

CREATE INDEX idx_chats_last_message_at ON public.chats USING btree (last_message_at DESC);

CREATE INDEX idx_forum_comments_created_at ON public.forum_comments USING btree (created_at);

CREATE INDEX idx_forum_comments_parent_id ON public.forum_comments USING btree (parent_comment_id);

CREATE INDEX idx_forum_comments_post_id ON public.forum_comments USING btree (post_id);

CREATE INDEX idx_forum_comments_user_id ON public.forum_comments USING btree (user_id);

CREATE INDEX idx_forum_posts_created_at ON public.forum_posts USING btree (created_at);

CREATE INDEX idx_forum_posts_user_id ON public.forum_posts USING btree (user_id);

CREATE INDEX idx_message_status_message_id ON public.message_status USING btree (message_id);

CREATE INDEX idx_message_status_user_id ON public.message_status USING btree (user_id);

CREATE INDEX idx_messages_chat_id ON public.messages USING btree (chat_id);

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);

CREATE UNIQUE INDEX message_status_message_id_user_id_key ON public.message_status USING btree (message_id, user_id);

CREATE UNIQUE INDEX message_status_pkey ON public.message_status USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

alter table "public"."chat_participants" add constraint "chat_participants_pkey" PRIMARY KEY using index "chat_participants_pkey";

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."forum_comments" add constraint "forum_comments_pkey" PRIMARY KEY using index "forum_comments_pkey";

alter table "public"."forum_posts" add constraint "forum_posts_pkey" PRIMARY KEY using index "forum_posts_pkey";

alter table "public"."message_status" add constraint "message_status_pkey" PRIMARY KEY using index "message_status_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."chat_participants" add constraint "chat_participants_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE not valid;

alter table "public"."chat_participants" validate constraint "chat_participants_chat_id_fkey";

alter table "public"."chat_participants" add constraint "chat_participants_chat_id_user_id_key" UNIQUE using index "chat_participants_chat_id_user_id_key";

alter table "public"."chat_participants" add constraint "chat_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."chat_participants" validate constraint "chat_participants_user_id_fkey";

alter table "public"."chats" add constraint "chats_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."chats" validate constraint "chats_created_by_fkey";

alter table "public"."forum_comments" add constraint "forum_comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public.forum_comments(id) ON DELETE CASCADE not valid;

alter table "public"."forum_comments" validate constraint "forum_comments_parent_comment_id_fkey";

alter table "public"."forum_comments" add constraint "forum_comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE not valid;

alter table "public"."forum_comments" validate constraint "forum_comments_post_id_fkey";

alter table "public"."forum_comments" add constraint "forum_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."forum_comments" validate constraint "forum_comments_user_id_fkey";

alter table "public"."forum_posts" add constraint "forum_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."forum_posts" validate constraint "forum_posts_user_id_fkey";

alter table "public"."message_status" add constraint "message_status_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE not valid;

alter table "public"."message_status" validate constraint "message_status_message_id_fkey";

alter table "public"."message_status" add constraint "message_status_message_id_user_id_key" UNIQUE using index "message_status_message_id_user_id_key";

alter table "public"."message_status" add constraint "message_status_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."message_status" validate constraint "message_status_user_id_fkey";

alter table "public"."messages" add constraint "messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_chat_id_fkey";

alter table "public"."messages" add constraint "messages_reply_to_id_fkey" FOREIGN KEY (reply_to_id) REFERENCES public.messages(id) ON DELETE SET NULL not valid;

alter table "public"."messages" validate constraint "messages_reply_to_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_chat_with_participants(user_ids uuid[], is_group boolean)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  new_chat_id uuid;
  chat_with_participants json;
begin
  -- Create the new chat
  insert into public.chats (is_group, last_message_at)
  values (is_group, now())
  returning id into new_chat_id;

  -- Add participants
  for i in 1..array_length(user_ids, 1) loop
    insert into public.chat_participants (chat_id, user_id)
    values (new_chat_id, user_ids[i]);
  end loop;

  -- Return the new chat with its participants
  SELECT
    row_to_json(c)
  INTO
    chat_with_participants
  FROM (
    SELECT
      *,
      (
        SELECT
          json_agg(
            json_build_object(
              'user_id', p.user_id,
              'user', (SELECT row_to_json(u) FROM (SELECT name FROM user_profiles WHERE id = p.user_id) u)
            )
          )
        FROM
          chat_participants p
        WHERE
          p.chat_id = new_chat_id
      ) as participants
    FROM
      chats
    WHERE
      id = new_chat_id
  ) c;

  return chat_with_participants;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.debug_chat_policies()
 RETURNS TABLE(table_name text, policy_name text, command text, permissive text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        tablename::TEXT,
        policyname::TEXT,
        cmd::TEXT,
        permissive::TEXT
    FROM pg_policies
    WHERE tablename IN ('chats', 'chat_participants', 'messages', 'message_status')
    ORDER BY tablename, policyname;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_claim(claim text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  SELECT nullif(current_setting('request.jwt.claims', true), '')::JSONB ->> claim
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_role()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  SELECT nullif(current_setting('request.jwt.claims', true), '')::JSONB -> 'user_metadata' ->> 'role'
$function$
;

CREATE OR REPLACE FUNCTION public.is_chat_participant(chat_id_param uuid, user_id_param uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM chat_participants
    WHERE chat_id = chat_id_param
    AND user_id = user_id_param
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_chat_last_message_time()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE chats 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_gesture_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public.gesture_contributions
    SET status = NEW.status,
        updated_at = NOW()
    WHERE id = NEW.gesture_id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."chat_participants" to "authenticated";

grant insert on table "public"."chat_participants" to "authenticated";

grant references on table "public"."chat_participants" to "authenticated";

grant select on table "public"."chat_participants" to "authenticated";

grant trigger on table "public"."chat_participants" to "authenticated";

grant truncate on table "public"."chat_participants" to "authenticated";

grant update on table "public"."chat_participants" to "authenticated";

grant delete on table "public"."chat_participants" to "service_role";

grant insert on table "public"."chat_participants" to "service_role";

grant references on table "public"."chat_participants" to "service_role";

grant select on table "public"."chat_participants" to "service_role";

grant trigger on table "public"."chat_participants" to "service_role";

grant truncate on table "public"."chat_participants" to "service_role";

grant update on table "public"."chat_participants" to "service_role";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."forum_comments" to "anon";

grant insert on table "public"."forum_comments" to "anon";

grant references on table "public"."forum_comments" to "anon";

grant select on table "public"."forum_comments" to "anon";

grant trigger on table "public"."forum_comments" to "anon";

grant truncate on table "public"."forum_comments" to "anon";

grant update on table "public"."forum_comments" to "anon";

grant delete on table "public"."forum_comments" to "authenticated";

grant insert on table "public"."forum_comments" to "authenticated";

grant references on table "public"."forum_comments" to "authenticated";

grant select on table "public"."forum_comments" to "authenticated";

grant trigger on table "public"."forum_comments" to "authenticated";

grant truncate on table "public"."forum_comments" to "authenticated";

grant update on table "public"."forum_comments" to "authenticated";

grant delete on table "public"."forum_comments" to "service_role";

grant insert on table "public"."forum_comments" to "service_role";

grant references on table "public"."forum_comments" to "service_role";

grant select on table "public"."forum_comments" to "service_role";

grant trigger on table "public"."forum_comments" to "service_role";

grant truncate on table "public"."forum_comments" to "service_role";

grant update on table "public"."forum_comments" to "service_role";

grant delete on table "public"."forum_posts" to "anon";

grant insert on table "public"."forum_posts" to "anon";

grant references on table "public"."forum_posts" to "anon";

grant select on table "public"."forum_posts" to "anon";

grant trigger on table "public"."forum_posts" to "anon";

grant truncate on table "public"."forum_posts" to "anon";

grant update on table "public"."forum_posts" to "anon";

grant delete on table "public"."forum_posts" to "authenticated";

grant insert on table "public"."forum_posts" to "authenticated";

grant references on table "public"."forum_posts" to "authenticated";

grant select on table "public"."forum_posts" to "authenticated";

grant trigger on table "public"."forum_posts" to "authenticated";

grant truncate on table "public"."forum_posts" to "authenticated";

grant update on table "public"."forum_posts" to "authenticated";

grant delete on table "public"."forum_posts" to "service_role";

grant insert on table "public"."forum_posts" to "service_role";

grant references on table "public"."forum_posts" to "service_role";

grant select on table "public"."forum_posts" to "service_role";

grant trigger on table "public"."forum_posts" to "service_role";

grant truncate on table "public"."forum_posts" to "service_role";

grant update on table "public"."forum_posts" to "service_role";

grant delete on table "public"."message_status" to "authenticated";

grant insert on table "public"."message_status" to "authenticated";

grant references on table "public"."message_status" to "authenticated";

grant select on table "public"."message_status" to "authenticated";

grant trigger on table "public"."message_status" to "authenticated";

grant truncate on table "public"."message_status" to "authenticated";

grant update on table "public"."message_status" to "authenticated";

grant delete on table "public"."message_status" to "service_role";

grant insert on table "public"."message_status" to "service_role";

grant references on table "public"."message_status" to "service_role";

grant select on table "public"."message_status" to "service_role";

grant trigger on table "public"."message_status" to "service_role";

grant truncate on table "public"."message_status" to "service_role";

grant update on table "public"."message_status" to "service_role";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";


  create policy "Allow authenticated users to insert chat participants"
  on "public"."chat_participants"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "delete_chat_participants"
  on "public"."chat_participants"
  as permissive
  for delete
  to authenticated
using ((user_id = auth.uid()));



  create policy "select_chat_participants"
  on "public"."chat_participants"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_chat_participant(chat_id, auth.uid())));



  create policy "update_chat_participants"
  on "public"."chat_participants"
  as permissive
  for update
  to authenticated
using ((user_id = auth.uid()));



  create policy "Allow authenticated users to create chats"
  on "public"."chats"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "select_chats"
  on "public"."chats"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.chat_participants
  WHERE ((chat_participants.chat_id = chats.id) AND (chat_participants.user_id = auth.uid())))));



  create policy "update_chats"
  on "public"."chats"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.chat_participants
  WHERE ((chat_participants.chat_id = chats.id) AND (chat_participants.user_id = auth.uid())))));



  create policy "Anyone can view comments"
  on "public"."forum_comments"
  as permissive
  for select
  to public
using (true);



  create policy "Auth users can create comments"
  on "public"."forum_comments"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Users can create their own comments"
  on "public"."forum_comments"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete own comments"
  on "public"."forum_comments"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can delete their own comments"
  on "public"."forum_comments"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own comments"
  on "public"."forum_comments"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can update their own comments"
  on "public"."forum_comments"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view all comments"
  on "public"."forum_comments"
  as permissive
  for select
  to public
using (true);



  create policy "Anyone can view posts"
  on "public"."forum_posts"
  as permissive
  for select
  to public
using (true);



  create policy "Auth users can create posts"
  on "public"."forum_posts"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Users can create their own posts"
  on "public"."forum_posts"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete own posts"
  on "public"."forum_posts"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can delete their own posts"
  on "public"."forum_posts"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own posts"
  on "public"."forum_posts"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can update their own posts"
  on "public"."forum_posts"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view all posts"
  on "public"."forum_posts"
  as permissive
  for select
  to public
using (true);



  create policy "Allow admin full access on categories"
  on "public"."gesture_categories"
  as permissive
  for all
  to public
using ((public.get_my_role() = 'admin'::text))
with check ((public.get_my_role() = 'admin'::text));



  create policy "Allow public read access on categories"
  on "public"."gesture_categories"
  as permissive
  for select
  to public
using (true);



  create policy "Allow admin full access on gestures"
  on "public"."gestures"
  as permissive
  for all
  to public
using ((public.get_my_role() = 'admin'::text))
with check ((public.get_my_role() = 'admin'::text));



  create policy "Allow authenticated users to insert gestures"
  on "public"."gestures"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



  create policy "Allow owner to delete their gestures"
  on "public"."gestures"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Allow owner to update their gestures"
  on "public"."gestures"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Allow public read access on gestures"
  on "public"."gestures"
  as permissive
  for select
  to public
using (true);



  create policy "insert_message_status"
  on "public"."message_status"
  as permissive
  for insert
  to authenticated
with check ((user_id = auth.uid()));



  create policy "select_message_status"
  on "public"."message_status"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM (public.messages
     JOIN public.chat_participants ON ((chat_participants.chat_id = messages.chat_id)))
  WHERE ((message_status.message_id = messages.id) AND (chat_participants.user_id = auth.uid()))))));



  create policy "update_message_status"
  on "public"."message_status"
  as permissive
  for update
  to authenticated
using ((user_id = auth.uid()));



  create policy "insert_messages"
  on "public"."messages"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.chat_participants
  WHERE ((chat_participants.chat_id = messages.chat_id) AND (chat_participants.user_id = auth.uid())))) AND (sender_id = auth.uid())));



  create policy "select_messages"
  on "public"."messages"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.chat_participants
  WHERE ((chat_participants.chat_id = messages.chat_id) AND (chat_participants.user_id = auth.uid())))));



  create policy "update_messages"
  on "public"."messages"
  as permissive
  for update
  to authenticated
using ((sender_id = auth.uid()));



  create policy "Enable read access for associated user profiles"
  on "public"."user_profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "authenticated_users_read_all_profiles"
  on "public"."user_profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "authenticated_users_update_own_profile"
  on "public"."user_profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id));


CREATE TRIGGER trigger_update_chat_last_message_time AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_chat_last_message_time();


  create policy "Allow admin full access to gesture media"
  on "storage"."objects"
  as permissive
  for all
  to public
using (((bucket_id = 'gestures'::text) AND (public.get_my_role() = 'admin'::text)));



  create policy "Allow authenticated users to upload gesture media"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'gestures'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Allow owner to delete their gesture media"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'gestures'::text) AND (owner = auth.uid())));



  create policy "Allow owner to update their gesture media"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'gestures'::text) AND (owner = auth.uid())));



  create policy "Allow public read access on gesture media"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'gestures'::text));



  create policy "Users can upload chat attachments"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'chat_attachments'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users can view all chat attachments"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'chat_attachments'::text));



