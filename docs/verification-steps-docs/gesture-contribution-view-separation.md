✅ Task Complete: Separate User/Admin Gesture Contribution Views with JWT Claims

## Changes Made:
- Created new `/gesture/manage-contributions` page for admin-only contribution management
- Updated `/gesture/view` to show only the current user's own contributions
- **Added middleware-based redirects using JWT claims** (best practice):
  - Admin accessing `/gesture/view` → redirected to `/gesture/manage-contributions`
  - Non-admin accessing `/gesture/manage-contributions` → redirected to `/gesture/view`
- **Created custom_access_token_hook** - Postgres function that injects `user_role` into JWT
- Updated `AppSidebar`, `GestureBrowseHeader`, `AdminQuickAccessPanel` navigation

## Setup Steps (One-time):

### 1. Apply Migration
```bash
# Test locally first
npx supabase db reset

# Push to remote
npx supabase db push
```

### 2. Enable Hook in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Hooks**
3. Find **"Customize Access Token (JWT) Claims"**
4. Click **Enable Hook**
5. Select:
   - Hook Type: **Postgres Function**
   - Schema: **public**
   - Function: **custom_access_token_hook**
6. Click **Save**

### 3. Log Out and Log Back In
- The JWT is only updated on new login
- Existing sessions won't have the new `user_role` claim until re-login

## Verification Steps:

### Step 1: Verify JWT Contains user_role
1. Login as admin
2. Open browser DevTools → Application → Cookies
3. Find `sb-*-auth-token` cookie
4. Copy the access_token value
5. Go to https://jwt.io and paste it
6. Look for `"user_role": "admin"` in the payload

### Step 2: Test Admin Redirects
1. Login as admin
2. Try accessing `http://localhost:3000/gesture/view` directly
3. **Expected:** Instant redirect to `/gesture/manage-contributions` (no flash)
4. Check sidebar shows "Manage Contributions"
5. Navigate to `/gesture/browse` - should see only "Manage Contributions" button

### Step 3: Test User Redirects
1. Login as non-admin user
2. Try accessing `http://localhost:3000/gesture/manage-contributions` directly
3. **Expected:** Instant redirect to `/gesture/view`
4. Check sidebar shows "My Contributions"
5. Navigate to `/gesture/browse` - should see "My Contributions" and "Contribute Gesture" buttons

### Step 4: Verify Data Isolation
1. As user: `/gesture/view` shows only YOUR contributions
2. As admin: `/gesture/manage-contributions` shows ALL contributions

## Troubleshooting:

**Redirect not working?**
- Make sure you logged out and logged back in after enabling the hook
- Check JWT at jwt.io for `user_role` claim
- Middleware falls back to `user_metadata.role` if claim missing

**Hook not showing in dashboard?**
- Verify migration was applied: `npx supabase db push`
- Check function exists in Database → Functions
