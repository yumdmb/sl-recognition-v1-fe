-- Admin User Setup Script
-- Run this in your Supabase SQL Editor

-- 1. First, check all current users and their roles
SELECT 
  id, 
  name, 
  email, 
  role, 
  created_at,
  updated_at
FROM user_profiles 
ORDER BY created_at DESC;

-- 2. Set specific users as admin (REPLACE WITH YOUR ACTUAL EMAIL)
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-admin-email@example.com';

-- 3. Example: Set multiple users as admin
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE email IN (
--   'admin1@example.com',
--   'admin2@example.com'
-- );

-- 4. Verify the changes
-- SELECT 
--   id, 
--   name, 
--   email, 
--   role
-- FROM user_profiles 
-- WHERE role = 'admin';

-- 5. Set a user back to regular user if needed
-- UPDATE user_profiles 
-- SET role = 'non-deaf' 
-- WHERE email = 'user@example.com';

-- Available roles: 'admin', 'deaf', 'non-deaf'
