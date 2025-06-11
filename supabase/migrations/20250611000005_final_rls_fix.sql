-- Final RLS fix - disable RLS temporarily, fix data, re-enable with better policies
-- This should resolve all authentication issues

-- Step 1: Temporarily disable RLS to fix data issues
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Clean up any existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role and admin access" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow user profile access" ON public.user_profiles;

-- Step 3: Ensure ALL auth users have profiles
INSERT INTO public.user_profiles (id, name, email, role, created_at, updated_at)
SELECT 
    au.id,
    COALESCE(
        au.raw_user_meta_data->>'name', 
        au.raw_user_meta_data->>'full_name',
        SPLIT_PART(au.email, '@', 1),
        'User'
    ) as name,
    COALESCE(au.email, 'unknown@example.com') as email,
    COALESCE(au.raw_user_meta_data->>'role', 'non-deaf') as role,
    COALESCE(au.created_at, NOW()) as created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL 
AND au.id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    name = CASE 
        WHEN public.user_profiles.name = 'User' OR public.user_profiles.name = '' OR public.user_profiles.name IS NULL 
        THEN EXCLUDED.name 
        ELSE public.user_profiles.name 
    END,
    email = EXCLUDED.email,
    updated_at = NOW();

-- Step 4: Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create simple, working RLS policies
-- Allow authenticated users to read their own profile
CREATE POLICY "authenticated_users_own_profile" ON public.user_profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- Allow authenticated users to update their own profile  
CREATE POLICY "authenticated_users_update_own_profile" ON public.user_profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile (for registration)
CREATE POLICY "authenticated_users_insert_own_profile" ON public.user_profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Allow service role full access (for server-side operations and functions)
CREATE POLICY "service_role_full_access" ON public.user_profiles
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Step 6: Update the user creation function to work properly with RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert with ON CONFLICT to handle race conditions
    INSERT INTO public.user_profiles (id, name, email, role, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            SPLIT_PART(NEW.email, '@', 1),
            'User'
        ),
        COALESCE(NEW.email, 'unknown@example.com'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'non-deaf'),
        COALESCE(NEW.created_at, NOW()),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION 
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Verification query
SELECT 
    'Migration completed successfully!' as status,
    (SELECT COUNT(*) FROM auth.users WHERE email IS NOT NULL) as auth_users_count,
    (SELECT COUNT(*) FROM public.user_profiles) as profiles_count,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles') as policies_count;
