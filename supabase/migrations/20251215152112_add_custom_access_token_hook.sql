-- Migration: Add custom access token hook to inject user role into JWT claims
-- Rollback: DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb); 
--           Then disable the hook in Supabase Dashboard > Authentication > Hooks

-- Create the auth hook function that injects user role into JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  -- Fetch the user role from user_profiles table
  SELECT role INTO user_role 
  FROM public.user_profiles 
  WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF user_role IS NOT NULL THEN
    -- Set the user_role claim in the JWT
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  ELSE
    -- Set null if no role found (fallback)
    claims := jsonb_set(claims, '{user_role}', 'null');
  END IF;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- Return the modified event
  RETURN event;
END;
$$;

-- Grant necessary permissions to supabase_auth_admin (required for auth hooks)
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

-- Revoke from other roles for security
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;

-- Grant read access to user_profiles for the auth admin
GRANT SELECT ON TABLE public.user_profiles TO supabase_auth_admin;

-- Add comment for documentation
COMMENT ON FUNCTION public.custom_access_token_hook IS 'Auth hook that injects user role from user_profiles into JWT claims as user_role';
