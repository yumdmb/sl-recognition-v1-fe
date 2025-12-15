✅ Task Complete: Remove Proficiency Level Section for Admin Users

## Changes Made

- Updated `src/app/(main)/profile/page.tsx` to add conditional rendering for the proficiency level section
- Wrapped the entire proficiency level section (Award icon, proficiency display, test buttons, and progress bar) in a conditional check: `{currentUser.role !== 'admin' && <ProficiencySection />}`
- The proficiency level section is now completely removed from the React component tree when the user role is 'admin'

## To Verify

### Test with Admin User:

1. Start the dev server: `npm run dev`
2. Log in as an admin user
3. Navigate to the Profile page at `/profile`
4. **Expected Result**: The proficiency level section should NOT be visible
   - No "Proficiency Level" label
   - No proficiency level display (Beginner/Intermediate/Advanced)
   - No "View History" button
   - No "Retake Test" button
   - No "Take Test" button
   - No progress bar

### Test with Regular User (deaf/non-deaf):

1. Log out and log in as a regular user (deaf or non-deaf role)
2. Navigate to the Profile page at `/profile`
3. **Expected Result**: The proficiency level section SHOULD be visible
   - "Proficiency Level" label is displayed
   - Proficiency level or "Not yet assessed" is shown
   - Test buttons are available ("View History", "Retake Test", or "Take Test")
   - Progress bar is shown (if not Advanced level)

## Look For

### Admin User Profile:
- ✅ User Information section displays: Full Name, Email, Account Type
- ✅ Account Type shows "admin"
- ✅ NO proficiency level section appears
- ✅ Account Actions section is still visible (Edit Profile, Change Password)

### Regular User Profile:
- ✅ User Information section displays: Full Name, Email, Account Type, Proficiency Level
- ✅ Account Type shows "deaf" or "non-deaf"
- ✅ Proficiency level section is fully visible and functional
- ✅ All test buttons work correctly

## Technical Details

**Requirement Validated**: Requirements 1.2
- "WHEN an admin views the Profile page THEN the SignBridge System SHALL not render the 'Proficiency Level' section since proficiency assessment applies only to regular users"

**Implementation Approach**:
- Used conditional rendering with `{currentUser.role !== 'admin' && ...}` to completely remove the proficiency section from the React tree for admin users
- This ensures the component is not just hidden with CSS, but actually not rendered at all
- All child components (buttons, progress bars, etc.) are also not rendered for admin users
