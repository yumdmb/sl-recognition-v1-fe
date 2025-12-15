✅ Task Complete: Separate User/Admin Gesture Contribution Views

## Changes Made:
- Created new `/gesture/manage-contributions` page for admin-only contribution management
- Updated `/gesture/view` to show only the current user's own contributions
- **Added middleware-based redirects** (best practice):
  - Admin accessing `/gesture/view` → redirected to `/gesture/manage-contributions`
  - Non-admin accessing `/gesture/manage-contributions` → redirected to `/gesture/view`
- Updated `AppSidebar` navigation:
  - Admin: "Manage Contributions" → `/gesture/manage-contributions`
  - Users: "My Contributions" → `/gesture/view`
- Updated `GestureBrowseHeader`:
  - Admin: Shows only "Manage Contributions" button
  - Users: Shows "My Contributions" and "Contribute Gesture" buttons
- Updated `AdminQuickAccessPanel` to link to `/gesture/manage-contributions`

## To Verify:

### As a Regular User:
1. Start dev server: `npm run dev`
2. Login as a non-admin user
3. Check sidebar: "My Contributions" link → `/gesture/view`
4. Navigate to `/gesture/view` - see only YOUR OWN contributions
5. Try accessing `/gesture/manage-contributions` directly → should redirect to `/gesture/view`
6. Navigate to `/gesture/browse` - see "My Contributions" and "Contribute Gesture" buttons

### As an Admin:
1. Login as an admin user
2. Check sidebar: "Manage Contributions" link → `/gesture/manage-contributions`
3. Try accessing `/gesture/view` directly → should redirect to `/gesture/manage-contributions`
4. Navigate to `/gesture/manage-contributions` - see ALL contributions with approve/reject
5. Navigate to `/gesture/browse` - see ONLY "Manage Contributions" button

## Look For:
- **Instant redirects** (no flash/loading) - middleware handles this server-side
- Sidebar shows correct link based on role
- `/gesture/browse` shows different buttons for admin vs users
